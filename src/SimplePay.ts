// @ts-ignore
import monerojs, { LibraryUtils, MoneroDaemonRpc, MoneroIncomingTransfer, MoneroOutputWallet, MoneroRpcConnection, MoneroUtils, MoneroWalletFull } from "monero-javascript";
import { ref } from "vue";

// TODO replace with callback init method
export const simplePayReady = ref(false)

export enum Network {
    mainnet = "mainnet",
    stagenet = "stagenet"
}

export enum PaymentStatus {
    unknown = 'not detected',
    confirming = 'confirming',
    successful = 'successful',
    failed = 'failed'
}

export enum TransactionResponseStatus {
    success = 'success',
    failure = 'failure'
}

export interface TransactionResponse {
    data: {
        block_height: number
        coinbase: boolean
        confirmations: number
        current_height: number
        extra: string
        inputs: []
        outputs: []
        mixin: number
        timestamp: number
        timestamp_utc: Date
        tx_fee: number
        tx_hash: string
        tx_size: number
        tx_version: number
    }
    status: TransactionResponseStatus
}

export interface PaymentRequest {
    integratedAddress: string
    paymentId: string
    requestAmount: number
    label?: string
    requestedConfirmations: number
}

export interface PaymentResponse {
    requestedPayment: PaymentRequest
    txData: TransactionResponse | undefined
    moneroTx?: any
    confirmations?: number
    paymentStatus: PaymentStatus
    paymentComplete: boolean
}

export interface SimplePayConfig {
    primaryAddress: string
    secretViewKey: string
    defaultConfirmations: number
    network: Network
    monerodUri: string
    monerodUsername?: string
    monerodPassword?: string
}

/**
 * TODO: only expose XMR units to consumer.  Handle atomic/conversion internally
 */
export class SimplePay {
    wallet!: MoneroWalletFull
    daemonRpc?: MoneroDaemonRpc
    moneroRpcConnection?: MoneroRpcConnection
    currentHeight?: number
    monerodModuleInitialized: boolean = false
    restoreHeight: any = 10000;
    defaultDaemonConnectionConfig = {
        //uri: 'http://xmr.node.itzmx.com:18081',
        //uri: 'http://iceland1.strangled.net:18089',
        //uri: 'http://127.0.0.1:38081',
        uri: 'https://node.xmr.gift:443',
        //uri: 'http://stagenet.melo.tools:38081',
        //uri: 'http://xmr-lux.boldsuck.org:38081',
        proxyToWorker: true,
    }
    syncProgress?: number;
    isSynced?: boolean;
    balance: any;
    unlockedBalance: any;
    isConnected?: boolean;
    constructor(private config: SimplePayConfig) {

    }

    getConfig(): SimplePayConfig {
        return this.config
    }

    async updateConfig(config?: SimplePayConfig) {
        if (config) {
            this.config = config
        }

        await LibraryUtils.loadFullModule();
        await this.initWallet()
    }

    async checkForPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {

        // TODO: Review returned promises/activate stricter tsconfig 
        const transactions: MoneroIncomingTransfer[] | undefined = await this.wallet.getIncomingTransfers({
            amount: paymentRequest.requestAmount,
            txQuery: {
                paymentId: paymentRequest.paymentId
            }
        })

        let paymentResponse: PaymentResponse = {
            requestedPayment: paymentRequest,
            txData: undefined,
            moneroTx: undefined,
            confirmations: undefined,
            paymentStatus: PaymentStatus.unknown,
            paymentComplete: false
        }

        if (transactions && transactions?.length > 0) {
            console.log('Transaction found!')
            console.log('Full transaction: ', transactions[0])
            console.log('getTx: ', transactions[0].getTx())
            const txData = transactions[0].getTx()

            console.log('transaction data', transactions[0].getTx().getNumConfirmations())

            paymentResponse.moneroTx = txData
            paymentResponse.confirmations = txData.getNumConfirmations()
            paymentResponse.paymentStatus = txData.getNumConfirmations() >= paymentRequest.requestedConfirmations ? PaymentStatus.successful : PaymentStatus.confirming
            paymentResponse.paymentComplete = txData.getNumConfirmations() >= paymentRequest.requestedConfirmations ? true : false
        }

        return paymentResponse
    }

    async initWallet(): Promise<void> {
        this.wallet = await monerojs.createWalletFull({
            password: "supersecretpassword123",
            networkType: this.config.network,
            primaryAddress: this.config.primaryAddress,
            privateViewKey: this.config.secretViewKey,
        });

        await this.wallet.addListener(this)
        console.log('Primary Address', await this.wallet.getPrimaryAddress())

        const connectionManager = this.newConnectionManager()
        await connectionManager.startCheckingConnection()

        console.log('wallet initialized')
    }

    async createPaymentRequest(amount: number, requestedConfirmations?: number, label?: string): Promise<PaymentRequest> {
        const addressState = await this.wallet.getIntegratedAddress()
        console.log("Using address: ", addressState)

        const paymentRequest: PaymentRequest = {
            integratedAddress: addressState.state.integratedAddress,
            paymentId: addressState.state.paymentId,
            requestAmount: amount,
            label: label,
            requestedConfirmations: requestedConfirmations ?? this.config.defaultConfirmations,
        }

        return paymentRequest
    }

    newConnectionManager() {
        const connection = new monerojs.MoneroRpcConnection({
            //uri: 'http://xmr.node.itzmx.com:18081',
            //uri: 'http://iceland1.strangled.net:18089',
            //uri: 'http://127.0.0.1:38081',
            uri: this.config.monerodUri,
            username: this.config.monerodUsername,
            password: this.config.monerodPassword,
            //uri: 'http://stagenet.melo.tools:38081',
            //uri: 'http://xmr-lux.boldsuck.org:38081',
            proxyToWorker: true,
        })
        const connectionManager = new monerojs.MoneroConnectionManager(true)
        connectionManager.addListener(this)
        connectionManager.setTimeout(40000)
        connectionManager.setConnection(connection)
        return connectionManager
    }

    convertAtomicUnitsToXmr(amount: string): number {
        console.log('converted to xmr', monerojs.MoneroUtils.atomicUnitsToXmr(amount))
        return monerojs.MoneroUtils.atomicUnitsToXmr(amount)
    }

    // MoneroWalletListener interface implementation below
    async onSyncProgress(height: any, startHeight: any, endHeight: any, percentDone: any) {
        console.log(`[event] Height: ${height} | StartHeight: ${startHeight} EndHeight: ${endHeight}`)
        this.syncProgress = percentDone * 100
        this.isSynced = (this.syncProgress === 100)
        console.debug("[event] sync", this.syncProgress, "%")

        if (this.syncProgress === 100) {
            simplePayReady.value = true
        }
    }

    async onBalancesChanged(newBalance, newUnlockedBalance) {
        this.balance = newBalance.toString(10)
        this.unlockedBalance = newUnlockedBalance.toString(10)
        console.debug("[event] balance", this.balance, "/", this.unlockedBalance)
    }

    async onNewBlock(height) {
        console.log('[event] block', height)
    }
    
    async onOutputReceived(output: MoneroOutputWallet) {
        console.log('[event] output amount', MoneroUtils.atomicUnitsToXmr(output.getAmount()))
        console.log('[event] output tx', output.getTx())
        // Invoked 3 times per received output: once when unconfirmed, once when confirmed, and once when unlocked. The notified output includes basic fields only, so the output or its transaction should be fetched to get all available fields.
        console.log('[event] output', output)

    }
    async onOutputSpent() { }

    // MoneroConnectionManagerListener
    async onConnectionChanged(connection) {
        this.isConnected = connection.isConnected() === true
        console.debug("[event] connection", this.isConnected)

        if (this.isConnected) {
            await this.wallet.setDaemonConnection(connection)

            // getDaemonHeight - 1 is here to prevent this issue:
            // https://github.com/monero-ecosystem/monero-javascript/issues/76
            this.restoreHeight = await this.wallet.getDaemonHeight()

            await this.wallet.setSyncHeight(this.restoreHeight-1)
            await this.wallet.startSyncing(10000)
        } else {
            await this.wallet.stopSyncing()
            simplePayReady.value = false
        }
    }
}

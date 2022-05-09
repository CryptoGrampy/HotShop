import monerojs, { LibraryUtils, MoneroDaemonRpc, MoneroIncomingTransfer, MoneroOutputWallet, MoneroRpcConnection, MoneroUtils, MoneroWalletFull } from "monero-javascript";
import { ref } from "vue";

// TODO replace with callback init method and use vue store
export const simplePayReady = ref(false)

// TODO Use monerojs class
export enum Network {
    mainnet = "mainnet",
    stagenet = "stagenet"
}

// TODO: Make these as cleaner display names
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
    paymentUri?: string
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

export class SimplePay {
    wallet!: MoneroWalletFull
    daemonRpc?: MoneroDaemonRpc
    moneroRpcConnection?: MoneroRpcConnection
    restoreHeight?;
    syncProgress?: number;
    balance: any;
    unlockedBalance: any;
    monerodConnectionStatus?: boolean;
    connectionManager?: monerojs.MoneroConnectionManager;
    constructor(private config: SimplePayConfig) { }

    public getConfig(): SimplePayConfig {
        return this.config
    }

    public async updateConfig(config?: SimplePayConfig) {
        if (config) {
            this.config = config
        }
        this.monerodConnectionStatus = false

        await LibraryUtils.loadFullModule();
        await this.initWallet()
    }

    public async checkForPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
        // TODO: Review returned promises/activate stricter tsconfig 
        // TODO: Review this txQuery and determine if this is appropriate way to get payment tx (esp double spend/failed part)
        const transactions: MoneroIncomingTransfer[] | undefined = await this.wallet.getIncomingTransfers({
            amount: MoneroUtils.xmrToAtomicUnits(paymentRequest.requestAmount),
            txQuery: {
                paymentId: paymentRequest.paymentId,
                isDoubleSpendSeen: false,
                isFailed: false
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
            console.log('Full transaction Data: ', transactions[0])
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

    public async initWallet(): Promise<void> {
        this.wallet = await monerojs.createWalletFull({
            // needs dummy password
            password: "supersecretpassword123",
            networkType: this.config.network,
            primaryAddress: this.config.primaryAddress,
            privateViewKey: this.config.secretViewKey,
        });

        await this.wallet.addListener(this)
        console.log('Primary Address', await this.wallet.getPrimaryAddress())

        this.connectionManager = this.newConnectionManager()
        await this.connectionManager.startCheckingConnection()

        console.log('wallet initialized')
    }

    public async createPaymentRequest(xmrAmount: number, requestedConfirmations?: number, label?: string): Promise<PaymentRequest> {
        const integratedAddressState: monerojs.MoneroIntegratedAddress = await this.wallet.getIntegratedAddress()

        const paymentRequest: PaymentRequest = {
            integratedAddress: integratedAddressState.getIntegratedAddress(),
            paymentId: integratedAddressState.getPaymentId(),
            requestAmount: xmrAmount,
            label: label,
            requestedConfirmations: requestedConfirmations ?? this.config.defaultConfirmations,
            paymentUri: this.createPaymentUri(integratedAddressState.getIntegratedAddress(), xmrAmount, label)
        }

        console.log('Current Payment Request', paymentRequest)

        return paymentRequest
    }

    // TODO replace with the Monero-Javascript implementation of this
    private createPaymentUri(integratedAddress: string, xmrAmount: number, label?: string) {
        return `monero:${integratedAddress}?tx_amount=${xmrAmount}&recipient_name=HotShop${label ? 'tx_amount' + label : ''}`
    }

    private newConnectionManager() {
        if (this.connectionManager) {
            this.connectionManager.clear()
        }

        const connection = new monerojs.MoneroRpcConnection({
            uri: this.config.monerodUri,
            username: this.config.monerodUsername,
            password: this.config.monerodPassword,
            proxyToWorker: true,
        })
        const connectionManager = new monerojs.MoneroConnectionManager(true)
        connectionManager.addListener(this)
        connectionManager.setTimeout(40000)
        connectionManager.setConnection(connection)
        return connectionManager
    }

    // MoneroWalletListener interface implementations 
    // TODO: Add these to separate class/extend in simplepay, make these methods private
    async onSyncProgress(height: any, startHeight: any, endHeight: any, percentDone: any) {
        console.log(`[event] Height: ${height} | StartHeight: ${startHeight} EndHeight: ${endHeight}`)
        this.syncProgress = percentDone * 100
        console.debug("[event] sync", this.syncProgress, "%")

        // We could generate payment id's immediately, but we need to wait until wallet is fully synced before we can scan for payments
        if (this.syncProgress === 100) {
            simplePayReady.value = true
        } else {
            simplePayReady.value = false
        }
    }

    onNewBlock(){}
    onOutputSpent(){}

    async onBalancesChanged(newBalance, newUnlockedBalance) {
        this.balance = newBalance.toString(10)
        this.unlockedBalance = newUnlockedBalance.toString(10)
        console.debug("[event] balance", this.balance, "/", this.unlockedBalance)
    }

    async onOutputReceived(output: MoneroOutputWallet) {
        console.log('[event] output amount', MoneroUtils.atomicUnitsToXmr(output.getAmount()))
        console.log('[event] output tx', output.getTx())
        // Invoked 3 times per received output: once when unconfirmed, once when confirmed, and once when unlocked. The notified output includes basic fields only, so the output or its transaction should be fetched to get all available fields.
        console.log('[event] output', output)

    }

    // MoneroConnectionManagerListener
    async onConnectionChanged(connection) {
        if (connection) {
            this.monerodConnectionStatus = connection.isConnected() === true
            console.log('connection', connection)
        }
        console.debug("[event] connection", this.monerodConnectionStatus)

        if (this.monerodConnectionStatus === true) {
            console.log('setting wallet daemon connectin')
            await this.wallet.setDaemonConnection(connection)

            // getDaemonHeight - 1 is here to prevent this issue:
            // https://github.com/monero-ecosystem/monero-javascript/issues/76
            this.restoreHeight = await this.wallet.getDaemonHeight()

            await this.wallet.setSyncHeight(this.restoreHeight - 1)
            await this.wallet.startSyncing(10000)
        } else {
            await this.wallet.stopSyncing()
            simplePayReady.value = false
        }
    }
}

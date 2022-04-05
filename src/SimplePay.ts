// @ts-ignore
import monerojs from "monero-javascript";
import axios, { AxiosResponse } from 'axios';

export enum StagenetExplorers {
    rino = 'https://community.rino.io/explorer/stagenet'
}

export enum MainnetExplorers {
    xmrChain = 'https://xmrchain.net',
    rino = 'https://community.rino.io/explorer/mainnet'
}

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

export interface Output {
    amount: number
    block_no: number
    in_mempool: boolean,
    output_idx: number
    output_pubkey: string,
    payment_id: string
    tx_hash: string
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
    output: Output | undefined
    txData: TransactionResponse | undefined
    paymentStatus: PaymentStatus
    paymentComplete: boolean
}

export interface SimplePayConfig {
    primaryAddress: string
    secretViewKey: string
    defaultConfirmations: number
    blockExplorer: string
    network: Network
}

export class SimplePay {
    wallet!: any

    constructor(private config: SimplePayConfig) {

    }

    getConfig(): SimplePayConfig {
        return this.config
    }

    async updateConfig(config: SimplePayConfig) {
        this.config = config
        await this.init()
    }

    async init(): Promise<void> {
        this.wallet = await monerojs.createWalletFull({
            password: "supersecretpassword123",
            networkType: this.config.network,
            primaryAddress: this.config.primaryAddress,
            privateViewKey: this.config.secretViewKey,
        });

        console.log('resolved')
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

    convertAtomicUnitsToXmr(amount: string): number {
        console.log('converted to xmr', monerojs.MoneroUtils.atomicUnitsToXmr(amount))
        return monerojs.MoneroUtils.atomicUnitsToXmr(amount)
    }

    convertXmrToAtomicUnits(amount: number): number {
        return monerojs.MoneroUtils.xmrToAtomicUnits(amount)
    }

    async checkForPaymentSuccess(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
        const { integratedAddress, paymentId, requestAmount, requestedConfirmations } = paymentRequest

        // Make a request for a user with a given ID

        let paymentResponse: PaymentResponse = {
            requestedPayment: paymentRequest,
            output: undefined,
            txData: undefined,
            paymentStatus: PaymentStatus.unknown,
            paymentComplete: false
        }

        try {
            const response = await axios.get(`${this.config.blockExplorer}/api/outputsblocks?address=${integratedAddress}&viewkey=${this.config.secretViewKey}&limit=5&mempool=1`)

            const outputs: Output[] = response.data.data.outputs
            let txOutput

            console.log('Outputs found on block explorer:', outputs)

            // If there are outputs, find the one that matches the unique payment id and requested amount
            if (outputs.length > 0) {
                for (let out in outputs) {
                    if (outputs[out].payment_id === paymentId && outputs[out].amount === requestAmount) {
                        console.log('Found an output match', outputs[out])
                        txOutput = outputs[out]
                    }
                }
            }

            if (txOutput) {
                paymentResponse.output = txOutput

                console.log('Getting Transaction Data...')
                // Generate list of requests for UI usage... display async confirmation status / move onto next transaction.  Maybe this is a separate class
                const res: AxiosResponse<TransactionResponse, any> | undefined = await this.getTransactionData(txOutput.tx_hash)

                if (res) {
                    paymentResponse.txData = res.data

                    if (res.data.status != TransactionResponseStatus.success) {
                        paymentResponse.paymentStatus = PaymentStatus.failed
                        console.log('Transaction failed - potential doublespend', paymentResponse.paymentStatus)
                    } else if (res.data.data.confirmations < requestedConfirmations) {
                        paymentResponse.paymentStatus = PaymentStatus.confirming
                    } else if (res.data.data.confirmations >= requestedConfirmations && res.data.status === TransactionResponseStatus.success) {
                        paymentResponse.paymentStatus = PaymentStatus.successful
                        paymentResponse.paymentComplete = true
                    }
                }
            }
            return paymentResponse

        } catch (err) {
            console.log('Error checking for payment', err)
            return paymentResponse
        }
    }

    async getTransactionData(txHash: String) {
        try {
            return await axios.get(`${this.config.blockExplorer}/api/transaction/${txHash}`)
        } catch (err) {
            console.log('Error fetching transactions', err)
        }
    }
}



/* eslint-disable @typescript-eslint/no-explicit-any */
import monerojs, {
  MoneroDaemonRpc,
  MoneroRpcConnection,
  MoneroWalletFull,
} from "monero-javascript";
import { ref } from "vue";

const moneroUtils = monerojs.MoneroUtils;

// TODO replace with callback init method and use vue store
export const simplePayReady = ref(false);

// TODO Use monerojs class
export enum Network {
  mainnet = "mainnet",
  stagenet = "stagenet",
}

// TODO: Make these as cleaner display names
export enum PaymentStatus {
  unknown = "not detected",
  confirming = "confirming",
  successful = "successful",
  failed = "failed",
}

export enum ConnectionStatus {
  setup = "Setting up HotShop",
  establishing = "Establishing connection with Monero node",
  connected = "Connection established",
  synchronizing = "Synchronizing blockchain",
  synchronized = "Synchronized",
  disconnected = "Disconnected",
}

export const monerodConnectionStatusText = ref(ConnectionStatus.setup);

export enum TransactionResponseStatus {
  success = "success",
  failure = "failure",
}

export interface TransactionResponse {
  data: {
    block_height: number;
    coinbase: boolean;
    confirmations: number;
    current_height: number;
    extra: string;
    inputs: [];
    outputs: [];
    mixin: number;
    timestamp: number;
    timestamp_utc: Date;
    tx_fee: number;
    tx_hash: string;
    tx_size: number;
    tx_version: number;
  };
  status: TransactionResponseStatus;
}

export interface PaymentRequest {
  integratedAddress: string;
  paymentId: string;
  requestAmount: number;
  label?: string;
  requestedConfirmations: number;
  paymentUri?: string;
}

export interface PaymentResponse {
  requestedPayment: PaymentRequest;
  txData: TransactionResponse | undefined;
  moneroTx;
  confirmations?: number;
  paymentStatus: PaymentStatus;
  paymentComplete: boolean;
}

export interface SimplePayConfig {
  primaryAddress: string;
  secretViewKey: string;
  defaultConfirmations: number;
  network: Network;
  monerodUri: string;
  monerodUsername?: string;
  monerodPassword?: string;
}

export class SimplePay {
  wallet!: MoneroWalletFull;
  daemonRpc?: MoneroDaemonRpc;
  moneroRpcConnection?: MoneroRpcConnection;
  restoreHeight?: number;
  syncProgress = ref(0);
  monerodConnectionStatus?: boolean;
  connectionManager?: monerojs.MoneroConnectionManager;
  constructor(private config: SimplePayConfig) {
    monerodConnectionStatusText.value = ConnectionStatus.setup;
  }

  public getConfig(): SimplePayConfig {
    return this.config;
  }

  public async updateConfig(config?: SimplePayConfig) {
    this.monerodConnectionStatus = false;
    monerodConnectionStatusText.value = ConnectionStatus.setup;
    if (config) {
      this.config = config;
    }

    if (this.wallet) {
      await this.wallet.close();
    }

    await this.initWallet();
  }

  public async checkForPayment(
    paymentRequest: PaymentRequest
  ): Promise<PaymentResponse> {
    // TODO: Review returned promises/activate stricter tsconfig
    // TODO: Review this txQuery and determine if this is appropriate way to get payment tx (esp double spend/failed part)
    const transactions = await this.wallet.getIncomingTransfers({
      amount: moneroUtils.xmrToAtomicUnits(paymentRequest.requestAmount),
      txQuery: {
        paymentId: paymentRequest.paymentId,
        isDoubleSpendSeen: false,
        isFailed: false,
      },
    });

    const paymentResponse: PaymentResponse = {
      requestedPayment: paymentRequest,
      txData: undefined,
      moneroTx: undefined,
      confirmations: undefined,
      paymentStatus: PaymentStatus.unknown,
      paymentComplete: false,
    };

    if (transactions && transactions?.length > 0) {
      const incomingTx = transactions[transactions.length - 1];

      if (
        moneroUtils.atomicUnitsToXmr(incomingTx.getAmount()) !==
        paymentRequest.requestAmount
      ) {
        return paymentResponse;
      }

      const txData = incomingTx.getTx();

      paymentResponse.moneroTx = txData;
      paymentResponse.confirmations = txData.getNumConfirmations();
      paymentResponse.paymentStatus =
        txData.getNumConfirmations() >= paymentRequest.requestedConfirmations
          ? PaymentStatus.successful
          : PaymentStatus.confirming;
      paymentResponse.paymentComplete =
        txData.getNumConfirmations() >= paymentRequest.requestedConfirmations
          ? true
          : false;
    }

    return paymentResponse;
  }

  public async initWallet(): Promise<void> {
    this.wallet = await monerojs.createWalletFull({
      // needs dummy password
      password: "supersecretpassword123",
      networkType: this.config.network,
      primaryAddress: this.config.primaryAddress,
      privateViewKey: this.config.secretViewKey,
      proxyToWorker: true,
    });

    await this.wallet.addListener(this);

    this.connectionManager = this.newConnectionManager();
    await this.connectionManager.startCheckingConnection();
  }

  public async createPaymentRequest(
    xmrAmount: number,
    label?: string,
    requestedConfirmations?: number
  ): Promise<PaymentRequest> {
    const integratedAddressState: monerojs.MoneroIntegratedAddress =
      await this.wallet.getIntegratedAddress();
    const paymentRequest: PaymentRequest = {
      integratedAddress: integratedAddressState.getIntegratedAddress(),
      paymentId: integratedAddressState.getPaymentId(),
      requestAmount: xmrAmount,
      label: label,
      requestedConfirmations:
        requestedConfirmations ?? this.config.defaultConfirmations,
      paymentUri: this.createPaymentUri(
        integratedAddressState.getIntegratedAddress(),
        xmrAmount,
        label
      ),
    };
    return paymentRequest;
  }

  // TODO replace with the Monero-Javascript implementation of this
  private createPaymentUri(
    integratedAddress: string,
    xmrAmount: number,
    label?: string
  ) {
    return `monero:${integratedAddress}?tx_amount=${xmrAmount}${
      label ? `&recipient_name=${label}` : ""
    }`;
  }

  private newConnectionManager() {
    if (this.connectionManager) {
      this.connectionManager.clear();
    }

    const connection = new monerojs.MoneroRpcConnection({
      uri: this.config.monerodUri,
      username: this.config.monerodUsername,
      password: this.config.monerodPassword,
      rejectUnauthorized: false,
      proxyToWorker: true,
    });
    const connectionManager = new monerojs.MoneroConnectionManager(true);
    connectionManager.addListener(this);
    connectionManager.setTimeout(40000);
    connectionManager.setConnection(connection);
    return connectionManager;
  }

  // MoneroWalletListener interface implementations
  // TODO: Add these to separate class/extend in simplepay, make these methods private
  async onSyncProgress(
    height: any,
    startHeight: any,
    endHeight: any,
    percentDone: any
  ) {
    monerodConnectionStatusText.value = ConnectionStatus.synchronizing;

    this.syncProgress.value = percentDone * 100;

    // We could generate payment id's immediately, but we need to wait until wallet is fully synced before we can scan for payments
    if (this.syncProgress.value === 100) {
      monerodConnectionStatusText.value = ConnectionStatus.synchronized;
      simplePayReady.value = true;
    } else {
      monerodConnectionStatusText.value = ConnectionStatus.synchronizing;
      simplePayReady.value = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onNewBlock() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOutputSpent() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onBalancesChanged(newBalance, newUnlockedBalance) {
    const balance = newBalance.toString(10);
    const unlockedBalance = newUnlockedBalance.toString(10);
    console.debug("[event] balance", balance, "/", unlockedBalance);
  }

  // MoneroConnectionManagerListener
  async onConnectionChanged(connection) {
    if (connection) {
      this.monerodConnectionStatus = connection.isConnected() === true;
      monerodConnectionStatusText.value = ConnectionStatus.connected;
    }

    if (this.monerodConnectionStatus === true) {
      await this.wallet.setDaemonConnection(connection);

      // getDaemonHeight - 1 is here to prevent this issue:
      // https://github.com/monero-ecosystem/monero-javascript/issues/76
      this.restoreHeight = await this.wallet.getDaemonHeight();

      await this.wallet.setSyncHeight(this.restoreHeight - 1);
      await this.wallet.startSyncing(5000);
      monerodConnectionStatusText.value = ConnectionStatus.synchronizing;
    } else {
      await this.wallet.stopSyncing();
      monerodConnectionStatusText.value = ConnectionStatus.disconnected;
      simplePayReady.value = false;
    }
  }
}

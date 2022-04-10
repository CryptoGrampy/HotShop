declare module '*.gif' {
    export default "" as string;
}
declare module '*.png' {
    export default "" as string;
}

type MoneroRpcConfig = {
    uri: string,
    username?: string,
    password?: string,
    rejectUnauthorized?: boolean
}

declare module 'monero-javascript' {
    declare module LibraryUtils {
        function loadFullModule(): Promise<MoneroWalletFull>;
        function loadKeysModule(): Promise<MoneroWalletKeys>;
    }

    declare class MoneroConnectionManager {
        constructor(proxy: boolean)

        addListener(listener: MoneroConnectionManagerListener): MoneroConnectionManager
        setTimeout(timeoutInMs: number): MoneroConnectionManager
        setConnection(uriOrConnection: MoneroRpcConnection | string): MoneroConnectionManager
        getConnection(): MoneroRpcConnection
        getConnections(): MoneroRpcConnection[]
        clear(): MoneroConnectionManager

        //defaults to 10000 i.e. 10 seconds
        startCheckingConnection(periodMs?: number): Promise<MoneroConnectionManager>
    }

    export function connectToDaemonRpc(uriOrConfigOrConnection: MoneroRpcConnection): MoneroDaemonRpc;

    export function createWalletFull(config: {
        path?: string,
        password?: string,
        networkType?: string | number,
        mnemonic?: string,
        seedOffset?: string,
        primaryAddress?: string,
        privateViewKey?: string,
        privateSpendKey?: string,
        restoreHeight?: number,
        language?: string,
        serverUri?: string,
        serverUsername?: string,
        serverPassword?: string,
        rejectUnauthorized?: boolean,
        server?: MoneroRpcConnection | MoneroRpcConfig,
        proxyToWorker?: boolean,
        fs?: fs
    }): MoneroWalletFull

    declare module MoneroNetworkType {
        const MAINNET: number;
        const STAGENET: number;
        const TESTNET: number;
    }

    declare class MoneroTxWallet {
        getReceivedTimestamp(): number;
        getFee(): BigInteger;
        getIncomingAmount(): BigInteger;
        getHeight(): number;
        getHash(): string;
        isConfirmed(): boolean;
    }

    declare class MoneroRpcConnection {
        constructor(uriOrConfigOrConnection: string | MoneroRpcConfig | object, username?: string, password?: string, rejectUnauthorized?: boolean, proxyToWorker?: boolean);
    }

    declare class MoneroDaemonRpc {
        async getBlockHeaderByHeight(height: number): Promise<MoneroBlockHeader>;
        async getRpcConnection(): Promise<MoneroRpcConnection>;
        async getHeight(): Promise<number>;
        async isConnected(): Promise<boolean>;
    }

    declare class MoneroBlockHeader {
        getTimestamp(): number;
    }

    declare module MoneroUtils {
        function validatePrivateViewKey(viewKey: string): void;
        function isValidAddress(address: string, networkType: MoneroNetworkType): boolean;
        function atomicUnitsToXmr(amount: string | BigInteger): number
        function xmrToAtomicUnits(amount: string | number): BigInteger
    }

    declare class MoneroIncomingTransfer {
        getTx(): MoneroTx

    }

    declare class MoneroTx {
        getNumConfirmations(): number
    }

    declare class MoneroWalletFull {
        async setDaemonConnection(uriOrConnection: string | MoneroDaemonRpc, username?: string, password?: string): Promise<MoneroRpcConnection>;
        async getPrimaryAddress(): Promise<string>;
        async getDaemonHeight(): Promise<number>;
        async setSyncHeight(height: number): Promise<number>;
        async getIntegratedAddress(paymentId?: string): Promise<MoneroIntegratedAddress>;
        async addListener(listener: MoneroWalletListener): Promise<void>;
        async sync(listener: any, startHeight: any, allowConcurrentCalls: bool): Promise<any>;
        async startSyncing(syncPeriod: any): Promise<void>;
        async isSynced(): Promise<boolean>;
        async getHeightByDate(year: number, month: number, day: number): Promise<number>;
        async getTx(hash: string): Promise<MoneroTxWallet>;
        async getTxs(query: any): Promise<MoneroTxWallet[]>;
        async getPrivateViewKey(): Promise<string>;
        async getIncomingTransfers(query: any): Promise<MoneroIncomingTransfer[]>
        async getAddress(accountIdx: int, subaddressIdx: int): Promise<string>;
        async stopSyncing(): Promise<void>

    }

    declare class MoneroWalletListener {
        async onBalancesChanged(newBalance: BigInteger, newUnlockedBalance: BigInteger)
    }

    declare class MoneroOutputWallet {
        getTx(): any;
        getAmount(): any
    }

    declare class MoneroTxQuery {

    }
    //function BigInteger(n: number): Uint8Array;

    declare class BigInteger {
        BigInteger(): Uint8Array;
        BigInteger(n: number): Uint8Array;
    }


    module.exports = MoneroWalletFull;
}

declare module 'jsbn';
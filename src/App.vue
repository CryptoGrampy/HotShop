<template>
    <el-container>
        <el-header>
            <h1>xmr.gift wallet</h1>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="24" class="text-right">
                    <el-tag v-if="config.networkType == 1" type="warning">TESTNET</el-tag>
                    <el-tag v-if="config.networkType == 2" type="warning">STAGENET</el-tag>
                </el-col>
            </el-row>

            <wallet
                    :balance="balance"
                    :unlockedBalance="unlockedBalance"
                    :address="primaryAddress"
                    :isConnected="isConnected"
                    :isSynced="isSynced"
                    :syncProgress="syncProgress"
                    :sendTransactionFunc="sweepUnlockedBalance"
            ></wallet>
        </el-main>
    </el-container>
</template>

<style scoped>
    .el-container {
        max-width:40em;
        margin:0 auto;
    }

    .text-right {
        text-align:right;
    }
</style>

<script>
    import monerojs from "monero-javascript"
    import moneroutils from "./moneroutils"
    import urlparams from "./urlparams"
    import hash from "./hash"
    import { ErrorInvalidMoneroAddress } from "./errors"

    const proxyToWorker = true
    const daemonConnectionTimeout = 40000
    const daemonCheckPeriod = 10000
    const daemonSyncPeriod = 30000
    const defaultNetworkType = monerojs.MoneroNetworkType.STAGENET

    export default {
        name: "App",

        data() {
            return {
                config: {},
                primaryAddress: null,
                isSynced: false,
                isConnected: false,
                syncProgress: 0,
                balance: "0",
                unlockedBalance: "0",
                defaultDaemonConnectionConfig: {
                    //uri: 'http://xmr.node.itzmx.com:18081',
                    //uri: 'http://iceland1.strangled.net:18089',
                    //uri: 'http://127.0.0.1:38081',
                    uri: 'https://node.xmr.gift:443',
                    //uri: 'http://stagenet.melo.tools:38081',
                    //uri: 'http://xmr-lux.boldsuck.org:38081',
                    proxyToWorker: proxyToWorker,
                }
            };
        },

        methods: {
            newConnectionManager() {
                const connection = new monerojs.MoneroRpcConnection(this.defaultDaemonConnectionConfig)
                const connectionManager = new monerojs.MoneroConnectionManager(proxyToWorker)
                connectionManager.addListener(this)
                connectionManager.setTimeout(daemonConnectionTimeout)
                connectionManager.setConnection(connection)
                return connectionManager
            },

            newWalletConfig(networkType, seed) {
                let config = {
                        language: 'English',
                        networkType: networkType,
                        // Password cannot be empty a dummy password will do.
                        password: 'walletPassword',
                        proxyToWorker: proxyToWorker,
                }
                if (seed !== '') {
                    const val = moneroutils.deriveAddressAndKeys(networkType, seed)
                    config = {
                        ...config,
                        ...{
                            primaryAddress: val[0],
                            privateViewKey: val[1],
                            privateSpendKey: val[2],
                        },
                    }
                }
                return config
            },

            async newWallet(config) {
                const wallet = await monerojs.createWalletFull(config)
                await wallet.addListener(this)
                return wallet
            },

            async sweepUnlockedBalance(address) {
                console.debug("sweepUnlockedBalance", address)
                if (!monerojs.MoneroUtils.isValidAddress(address, this.config.networkType)) {
                    throw new ErrorInvalidMoneroAddress("Invalid Monero address")
                }
                return this.wallet.sweepUnlocked({
                    address: address,
                    relay: true,
                })
            },

            // MoneroWalletListener interface implementation
            onSyncProgress(height, startHeight, endHeight, percentDone) {
                this.syncProgress = parseInt(percentDone * 100)
                this.isSynced = (this.syncProgress === 100)
                console.debug("[event] sync", this.syncProgress, "%")
            },

            onBalancesChanged(newBalance, newUnlockedBalance) {
                this.balance = newBalance.toString(10)
                this.unlockedBalance = newUnlockedBalance.toString(10)
                console.debug("[event] balance", this.balance, "/", this.unlockedBalance)
            },

            onNewBlock(){},
            onOutputReceived(){},
            onOutputSpent(){},

            // MoneroConnectionManagerListener
            async onConnectionChanged(connection){
                this.isConnected = connection.isConnected() === true
                console.debug("[event] connection", this.isConnected)

                if (this.isConnected) {
                    await this.wallet.setDaemonConnection(connection)

                    // getDaemonHeight - 1 is here to prevent this issue:
                    // https://github.com/monero-ecosystem/monero-javascript/issues/76
                    if (this.restoreHeight == null) {
                        this.restoreHeight = await this.wallet.getDaemonHeight() - 1
                        urlparams.setRestoreHeight(this.restoreHeight)
                    }

                    await this.wallet.setSyncHeight(this.restoreHeight)
                    await this.wallet.startSyncing(daemonSyncPeriod)
                } else {
                    await this.wallet.stopSyncing()
                }
            }
        },

        async mounted() {
            // Load wasm keys module to enable MoneroUtils.isValidAddress
            await monerojs.LibraryUtils.loadKeysModule()
            // Override the default path to monero_web_worker.js
            monerojs.LibraryUtils.setWorkerDistPath("./monero_web_worker.js")

            const seed = hash.get()
            // Validate the seed if there's one set
            if (seed !== "") {
                if (!monerojs.MoneroUtils.isValidPrivateSpendKey(seed)) {
                    // TODO: set a user visible error!
                    console.error("invalid seed!")
                    return
                }
            }

            this.restoreHeight = urlparams.getRestoreHeight()
            if (isNaN(this.restoreHeight)) {
                // TODO: set a user visible error!
                console.error("invalid restore height!")
                return
            }

            let networkType = urlparams.getNetworkType(defaultNetworkType)
            if (!monerojs.MoneroNetworkType.isValid(networkType)) {
                // TODO: set a user visible error!
                console.error("invalid network type!")
                return
            }

            this.config = this.newWalletConfig(networkType, seed)
            this.wallet = await this.newWallet(this.config)
            this.primaryAddress = await this.wallet.getPrimaryAddress()

            const privateSpendKey = await this.wallet.getPrivateSpendKey()
            hash.set(privateSpendKey)

            const connectionManager = this.newConnectionManager()
            await connectionManager.startCheckingConnection(daemonCheckPeriod)
        },

        beforeUnmount() {
            this.wallet.close()
        },
    }
</script>

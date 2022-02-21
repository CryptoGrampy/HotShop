<template>
    <el-container>
        <el-header>
            <h1>xmr.gift wallet</h1>
        </el-header>
        <el-main>
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

    <hr>

    <div>Network: {{ defaultWalletConfig.networkType }}</div>
    <div>Primary address: {{ primaryAddress }}</div>
    <div>Mnemonic: {{ mnemonic }}</div>
    <div>Connected: {{ isConnected }}</div>
    <div v-if="isConnected">
        <div>Synced: {{ isSynced }}</div>
        <div v-if="isSynced">
            <div>Balance: {{ balance }}</div>
            <div>Unlocked balance: {{ unlockedBalance }}</div>
        </div>
    </div>
</template>

<style scoped>
    .el-container {
        max-width:40em;
        margin:0 auto;
    }
</style>

<script>
    import monerojs from "monero-javascript"
    import moneroutils from "./moneroutils"
    import { ErrorInvalidMoneroAddress } from "./errors"

    const proxyToWorker = true
    const daemonConnectionTimeout = 10000
    const daemonCheckPeriod = 10000
    const daemonSyncPeriod = 30000

    export default {
        name: "App",

        data() {
            return {
                primaryAddress: null,
                mnemonic: null,
                isSynced: false,
                isConnected: false,
                syncProgress: 0,
                balance: "0",
                unlockedBalance: "0",
                defaultWalletConfig: {
                    language: 'English',
                    networkType: monerojs.MoneroNetworkType.STAGENET,
                    // Password cannot be empty a dummy password will do.
                    password: 'walletPassword',
                    proxyToWorker: proxyToWorker,
                },
                defaultDaemonConnectionConfig: {
                    //uri: 'http://xmr.node.itzmx.com:18081',
                    //uri: 'http://iceland1.strangled.net:18089',
                    //uri: 'http://127.0.0.1:38081',
                    uri: 'https://node.xmr.gift',
                    //uri: 'http://stagenet.melo.tools:38081',
                    //uri: 'http://xmr-lux.boldsuck.org:38081',
                    proxyToWorker: proxyToWorker,
                }
            };
        },

        methods: {
            getParamRestoreHeight() {
                const urlParams = new URLSearchParams(window.location.search)
                let restoreHeight = null
                if (urlParams.has("h")) {
                    restoreHeight = parseInt(urlParams.get("h"))
                }
                return restoreHeight
            },

            setParamRestoreHeight(restoreHeight) {
                const urlParams = new URLSearchParams(window.location.search)
                urlParams.set("h", restoreHeight)
                const newState = "?"+urlParams.toString()+window.location.hash
                history.replaceState(null, "", newState)
            },

            async newConnectionManager() {
                const connection = new monerojs.MoneroRpcConnection(this.defaultDaemonConnectionConfig)
                const connectionManager = new monerojs.MoneroConnectionManager(proxyToWorker)
                await connectionManager.addListener(this)
                await connectionManager.setTimeout(daemonConnectionTimeout)
                await connectionManager.setConnection(connection)
                return connectionManager
            },

            async newWallet(seed) {
                let config = {
                    ...this.defaultWalletConfig,
                }

                if (seed !== '') {
                    console.log('recovering a wallet')
                    const privateSpendKey = seed
                    const privateViewKey = moneroutils.derivePrivateViewKey(privateSpendKey)
                    const publicSpendKey = moneroutils.derivePublicKey(privateSpendKey)
                    const publicViewKey = moneroutils.derivePublicKey(privateViewKey)
                    const primaryAddress = moneroutils.derivePrimaryAddress(this.defaultWalletConfig.networkType, publicSpendKey, publicViewKey)
                    config = {
                        ...config,
                        ...{
                            primaryAddress: primaryAddress,
                            privateViewKey: privateViewKey,
                            privateSpendKey: privateSpendKey,
                        },
                    }
                }

                const wallet = await monerojs.createWalletFull(config)
                await wallet.addListener(this)
                return wallet
            },

            async sweepUnlockedBalance(address) {
                console.debug("sweepUnlockedBalance", address)
                if (!monerojs.MoneroUtils.isValidAddress(address, this.defaultWalletConfig.networkType)) {
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

                if ( this.isConnected ) {
                    // getDaemonHeight - 1 is here to prevent this issue:
                    // https://github.com/monero-ecosystem/monero-javascript/issues/76
                    if (this.restoreHeight == null) {
                        this.restoreHeight = await this.wallet.getDaemonHeight() - 1
                        this.setParamRestoreHeight(this.restoreHeight)
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

            const seed = window.location.hash.substr(1)
            // Validate the seed if there's one set
            if (seed !== "") {
                if (!monerojs.MoneroUtils.isValidPrivateSpendKey(seed)) {
                    // TODO: set a user visible error!
                    console.error("invalid seed!")
                    return
                }
            }

            try {
                this.restoreHeight = this.getParamRestoreHeight()
            } catch (e) {
                // TODO: set a user visible error!
                console.error("invalid restore height!")
                return
            }

            this.wallet = await this.newWallet(seed)
            this.mnemonic = await this.wallet.getMnemonic()
            this.privateSpendKey = await this.wallet.getPrivateSpendKey()
            this.privateViewKey = await this.wallet.getPrivateViewKey()
            this.publicSpendKey = await this.wallet.getPublicSpendKey()
            this.publicViewKey = await this.wallet.getPublicViewKey()
            this.primaryAddress = await this.wallet.getPrimaryAddress()

            window.location.hash = this.privateSpendKey

            console.log('mnemonic:', this.mnemonic)
            console.log('private spend key:', this.privateSpendKey)
            console.log('private view key:', this.privateViewKey)
            console.log('public spend key:', this.publicSpendKey)
            console.log('public view key:', this.publicViewKey)
            console.log('primary address:', this.primaryAddress)

            const connectionManager = await this.newConnectionManager()

            await this.wallet.setDaemonConnection(connectionManager.getConnection())

            await connectionManager.startCheckingConnection(daemonCheckPeriod)

        },

        beforeUnmount() {
            this.wallet.close()
        },
    }
</script>

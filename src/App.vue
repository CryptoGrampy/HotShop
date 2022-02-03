<template>
    <div>Primary address: {{ primaryAddress }}</div>
    <div>Mnemonic: {{ mnemonic }}</div>
    <div>Connected: {{ isConnected }}</div>
    <div>Synced: {{ isSynced }}</div>
    <div>Balance: {{ balance }}</div>
    <div>Unlocked balance: {{ unlockedBalance }}</div>
</template>

<script>
    import monerojs from "monero-javascript"
    import moneroutils from "./moneroutils"
    import memfs from "memfs"

    export default {
        name: "App",

        methods: {
            async newConnectionManager() {
                const connection = new monerojs.MoneroRpcConnection(this.defaultDaemonConnectionConfig)
                const connectionManager = new monerojs.MoneroConnectionManager(true)
                await connectionManager.addListener(this)
                // TODO: add in config
                await connectionManager.setTimeout(15000)
                await connectionManager.setConnection(connection)
                // TODO: add in config
                await connectionManager.startCheckingConnection(10000)

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

            // MoneroWalletListener interface implementation
            onSyncProgress(height, startHeight, endHeight, percentDone, message) {
                console.log("[event] sync", percentDone * 100, "%")
                this.isSynced = (percentDone * 100 === 100)
            },

            onBalancesChanged(newBalance, newUnlockedBalance) {
                this.balance = newBalance
                this.unlockedBalance = newUnlockedBalance
                console.log("[event] balance", this.balance.toString(10), "/", this.unlockedBalance.toString(10))
            },

            onNewBlock(height){},
            onOutputReceived(output){},
            onOutputSpent(output){},

            // MoneroConnectionManagerListener
            onConnectionChanged(connection){
                this.isConnected = connection.isConnected()
                console.log("[event] connection", connection.isConnected())
            }
        },

        async mounted() {
            const seed = window.location.hash.substr(1)
            // Validate the seed if there's one set
            if (seed !== "") {
                if (!monerojs.MoneroUtils.isValidPrivateSpendKey(seed)) {
                    // TODO: assign an error code in this.errorCode
                    console.error("invalid seed!")
                    return
                }
            }

            const urlParams = new URLSearchParams(window.location.search)
            let restoreHeight = null
            if (urlParams.has("h")) {
                try {
                    restoreHeight = parseInt(urlParams.get("h"))
                } catch (e) {
                    // TODO: assign an error code in this.errorCode
                    console.error("invalid restore height!")
                    return
                }
            }

            const wallet = await this.newWallet(seed)
            this.mnemonic = await wallet.getMnemonic()
            this.privateSpendKey = await wallet.getPrivateSpendKey()
            this.privateViewKey = await wallet.getPrivateViewKey()
            this.publicSpendKey = await wallet.getPublicSpendKey()
            this.publicViewKey = await wallet.getPublicViewKey()
            this.primaryAddress = await wallet.getPrimaryAddress()

            window.location.hash = this.privateSpendKey

            console.log('mnemonic:', this.mnemonic)
            console.log('private spend key:', this.privateSpendKey)
            console.log('private view key:', this.privateViewKey)
            console.log('public spend key:', this.publicSpendKey)
            console.log('public view key:', this.publicViewKey)
            console.log('primary address:', this.primaryAddress)

            const connectionManager = await this.newConnectionManager()

            await wallet.setDaemonConnection(connectionManager.getConnection())

            restoreHeight = (restoreHeight == null) ? await wallet.getDaemonHeight():restoreHeight
            await wallet.setSyncHeight(restoreHeight - 1)

            console.log("daemon height", await wallet.getDaemonHeight())
            console.log("sync height", await wallet.getSyncHeight())

            // TODO: add in config...
            await wallet.startSyncing(30000)
        },

        beforeDestroy() {
            this.wallet.close()
        },

        data() {
            return {
                primaryAddress: null,
                mnemonic: null,
                isSynced: false,
                isConnected: false,
                balance: 0,
                unlockedBalance: 0,
                defaultWalletConfig: {
                    language: 'English',
                    networkType: monerojs.MoneroNetworkType.STAGENET,
                    // Password cannot be empty a dummy password will do.
                    password: 'walletPassword',
                    proxyToWorker: true,
                    fs: memfs,
                },
                defaultDaemonConnectionConfig: {
                    // NOTICE: must contain http:// or https://
                    //uri: 'http://stagenet.melo.tools:38081',
                    //uri: 'http://xmr.node.itzmx.com:18081',
                    //uri: 'http://iceland1.strangled.net:18089',
                    uri: 'http://xmr-lux.boldsuck.org:38081',
                    proxyToWorker: true,
                }
            };
        },
    }
</script>

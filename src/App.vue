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
            newDaemonConnection() {
                return new monerojs.MoneroRpcConnection(this.defaultDaemonConnectionConfig)
            },

            newDaemonConnectionManager() {
                return new monerojs.MoneroConnectionManager(true)
            },

            async newWallet(seed) {
                let config = {
                    ...this.defaultWalletConfig,
                }

                if (seed !== '') {
                    // TODO: check if seed is valid!
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
                            restoreHeight: 1016700,
                        },
                    }
                } else {
                    console.log('generating a wallet')
                }
                return monerojs.createWalletFull(config)
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

            this.wallet = await this.newWallet(seed)
            this.mnemonic = await this.wallet.getMnemonic()
            this.privateSpendKey = await this.wallet.getPrivateSpendKey()
            this.privateViewKey = await this.wallet.getPrivateViewKey()
            this.publicSpendKey = await this.wallet.getPublicSpendKey()
            this.publicViewKey = await this.wallet.getPublicViewKey()
            this.primaryAddress = await this.wallet.getPrimaryAddress()

            window.location.hash = this.privateSpendKey

            console.log(this.mnemonic)
            console.log('private spend key:', this.privateSpendKey)
            console.log('private view key:', this.privateViewKey)
            console.log('public spend key:', this.publicSpendKey)
            console.log('public view key:', this.publicViewKey)
            console.log('primary address:', this.primaryAddress)

            let connection = this.newDaemonConnection()
            let connectionManager = this.newDaemonConnectionManager()
            await connectionManager.setConnection(connection)
            await connectionManager.addListener(this)
            // TODO: set timeout in a config
            await connectionManager.setTimeout(15000)
            // TODO: set interval in a config
            await connectionManager.startCheckingConnection(10000)

            await this.wallet.setDaemonConnection(connection)
            await this.wallet.addListener(this)
            await this.wallet.startSyncing(30000)
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
                    uri: 'http://stagenet.melo.tools:38081',
                    proxyToWorker: true,
                }
            };
        },
    }
</script>

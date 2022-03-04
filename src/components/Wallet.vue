<template>
    <el-card v-if="currentCard == 'balance'" class="box-card">
        <el-row>
            <el-col class="text-center">
                <h1>Available balance</h1>
            </el-col>
        </el-row>

        <el-row>
            <el-col class="text-center">
                <h2>{{ formatBalance }} XMR</h2>
            </el-col>
        </el-row>

        <el-row>
            <el-col class="text-center">
                <wallet-button
                        :status="walletStatus"
                        @redeem-click="currentCard = 'redeem'"
                        @deposit-click="currentCard = 'deposit'"
                ></wallet-button>
            </el-col>
        </el-row>
    </el-card>

    <deposit-card
            v-if="currentCard == 'deposit'"
            @back="currentCard = 'balance'"
            :address="address"
    ></deposit-card>

    <redeem-card
            v-if="currentCard == 'redeem'"
            @back="currentCard = 'balance'"
            :redeemBalanceFunc="sendTransaction"
    ></redeem-card>
</template>

<style scoped>
    h1, h2 {
        margin:0.75em;
    }

    .text-center {
        text-align:center;
    }
</style>

<script>
    import { MoneroUtils } from "monero-javascript"
    import WalletButton from "./WalletButton.vue"
    import RedeemCard from "./RedeemCard.vue"
    import DepositCard from "./DepositCard.vue"

    export default {
        name: "Wallet",

        components: {
            "wallet-button": WalletButton,
            "redeem-card": RedeemCard,
            "deposit-card": DepositCard,
        },

        props: {
            balance: String,
            unlockedBalance: String,
            address: String,
            isLoaded: Boolean,
            isConnected: Boolean,
            isSynced: Boolean,
            syncProgress: Number,
            sendTransactionFunc: Function,
        },

        data() {
            return {
                currentCard: "balance"
            }
        },

        methods: {
            async sendTransaction(address) {
                console.log("send transaction")
                return this.$props.sendTransactionFunc(address)
            }
        },

        computed: {
            walletStatus() {
                let status = {}
                if ( !this.isLoaded ) {
                    status = {
                        action: "loading",
                    }
                } else if ( !this.isConnected ) {
                    status = {
                        action: "connecting",
                    }
                } else if ( this.isConnected && !this.isSynced ) {
                    status = {
                        action: "syncing",
                        progress: this.syncProgress,
                    }
                } else {
                    status = {
                        action: "ready",
                        unlocked: this.balance === this.unlockedBalance,
                        empty: this.balance === "0",
                    }
                }
                return status
            },

            // TODO: pass as $props.formatBalanceFunc
            formatBalance() {
                return MoneroUtils.atomicUnitsToXmr(this.balance)
            },
        },
    }
</script>
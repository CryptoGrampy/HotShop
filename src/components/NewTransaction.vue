<template>
    <button v-if="!showTransferForm" v-on:click="showTransferForm = !showTransferForm">Transfer</button>
    <form v-if="showTransferForm" @submit="submitTransaction">
        <input type="text" v-model="destinationAddress" placeholder="Address">
        <button type="submit">Confirm</button>
        <button type="reset" v-on:click="showTransferForm = false">Cancel</button>
    </form>
</template>
<script>
    export default {
        name: "NewTransaction",

        data() {
            return {
                showTransferForm: false,
                destinationAddress: "",
            }
        },

        methods: {
            async submitTransaction(e) {
                e.preventDefault()
                // TODO: validate Monero Address!
                console.log("submit transaction!", this.destinationAddress, this.$parent.unlockedBalance)
                const wallet = this.$parent.wallet
                await wallet.sweepUnlocked({
                    address: this.destinationAddress,
                    relay: true,
                })
            },
        }
    };
</script>
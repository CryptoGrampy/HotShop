<template>
    <el-card class="box-card">
        <template #header>
            <el-page-header content="Redeem" @back="$emit('back')"></el-page-header>
        </template>

        <div v-if="!isDone">
            <!--<el-steps :active="step" align-center>
                <el-step title="Introduction"></el-step>
                <el-step title="Install a wallet"></el-step>
                <el-step title="New wallet"></el-step>
                <el-step title="Send"></el-step>
            </el-steps>-->

            <!--<div v-if="step == 0">
                <p>To redeem the gift card, you are going to need a private wallet to which the available balance will be sent.</p>

                <p>If this is your first time, follow this quick tutorial to learn how.
                    If you already have a wallet feel free to skip to the end.</p>
            </div>-->

            <!--<div v-if="step == 1">
                <p>Start by installing a wallet software on your mobile device. We recommend Monero.com.</p>

                <h3><a href="#">Download Monero.com from App Store</a></h3>

                <h3><a href="#">Download Monero.com from Google Play</a></h3>

                <p>Once you have installed Monero.com continue to the next step.</p>
            </div>-->

            <!--<div v-if="step == 2">
                <p>TODO: add a visual guide on how to create a new wallet in Monero.com.</p>
            </div>-->

            <div v-if="step == 3">
                <p>To redeem, you will need a private wallet to which the available balance will be sent.</p>

                <p>Here are some things to keep in mind:</p>

                <ul>
                    <li><strong>Never type the address by hand to avoid making a mistake!</strong></li>
                    <li>The transaction is permanent. You won't be able to reverse it once it has been submitted.</li>
                    <li>You will see the funds in your private wallet within a few minutes after submitting the transaction.</li>
                </ul>

                <el-form :model="form">
                    <el-form-item label="Destination address" :error="error" required>
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <el-row justify="end">
                <el-col v-if="step != maxStep" :span="12">
                    <el-button @click="step = maxStep" type="primary">Skip</el-button>
                </el-col>
                <el-col :span="12" class="text-right">
                    <el-button v-if="step > minStep" @click="step -= 1">Back</el-button>
                    <el-button v-if="step != maxStep" @click="step += 1">Next</el-button>
                    <el-button v-if="step == maxStep" :disabled="form.address === ''" :loading="isInProgress" @click="redeemBalance" type="success">Send to my wallet</el-button>
                </el-col>
            </el-row>
        </div>

        <div v-if="isDone">
            <el-result
                    icon="success"
                    title="Transaction sent!"
            >
            </el-result>

            <div class="text-center">
                <h3>What's next?</h3>
                <p>Monero is money so best is to, of course, spend it!
                    To give you some ideas what you can purchase <strong>today</strong>, visit AcceptedHere's
                    <a href="https://acceptedhere.io/catalog/currency/xmr/" target="_blank">catalog of businesses accepting Monero</a>.</p>
            </div>
        </div>
    </el-card>
</template>

<style scoped>
    .text-right {
        text-align:right;
    }

    .text-center {
        text-align:center;
    }
</style>

<script>
    import { ErrorInvalidMoneroAddress } from "../errors"

    export default {
        name: "RedeemDialog",

        props: {
            redeemBalanceFunc: Function,
        },

        data() {
            return {
                step: 3,
                minStep: 3,
                maxStep: 3,
                form: {
                    address: ""
                },
                isInProgress: false,
                isDone: false,
                error: null,
            }
        },

        emits: [
            "back"
        ],

        methods: {
            async redeemBalance() {
                console.debug("redeem balance")
                this.form.address = this.form.address.trim()
                if (this.form.address === "") {
                    this.error = Error("You must provide an address").message
                    return
                }
                this.isInProgress = true
                this.$props.redeemBalanceFunc(this.form.address).then(txWallet => {
                    console.debug("redeem balance successful success", txWallet[0])
                    this.isDone = true
                    this.isInProgress = false
                    this.error = null
                }).catch(reason => {
                    console.error("redeem balance failed", reason.toString())
                    this.isInProgress = false
                    if (reason instanceof ErrorInvalidMoneroAddress) {
                        this.error = reason.message
                        return
                    }
                    this.error = Error("Oops, something went wrong.").message
                })
            }
        }
    }
</script>
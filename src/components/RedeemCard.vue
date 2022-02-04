<template>
    <el-card class="box-card">
        <template #header>
            <el-page-header content="Redeem" @back="$emit('back')"></el-page-header>
        </template>

        <el-steps :active="step" align-center>
            <el-step title="Introduction"></el-step>
            <el-step title="Install a wallet"></el-step>
            <el-step title="New wallet"></el-step>
            <el-step title="Send"></el-step>
        </el-steps>

        <div v-if="step == 0">
            <p>To redeem the gift card, you are going to need a private wallet to which the available balance will be sent.</p>

            <p>If this is your first time, follow this quick tutorial to learn how.
                If you already have a wallet feel free to skip to the end.</p>
        </div>

        <div v-if="step == 1">
            <p>Start by installing a wallet software on your mobile device. We recommend Monero.com.</p>

            <h3><a href="#">Download Monero.com from App Store</a></h3>

            <h3><a href="#">Download Monero.com from Google Play</a></h3>

            <p>Once you have installed Monero.com continue to the next step.</p>
        </div>

        <div v-if="step == 2">
            <p>TODO: add a visual guide on how to create a new wallet in Monero.com.</p>
        </div>

        <div v-if="step == 3">
            <p>Here are some things to keep in mind:</p>

            <ul>
                <li><strong>Never type the address by hand to avoid making a mistake!</strong> Use copy and paste. </li>
                <li>The transaction is permanent. You won't be able to reverse it once it has been submitted.</li>
                <li>You will see the funds in your private wallet within a few minutes after submitting the transaction.</li>
                <li>Monero is money. Spend it!</li>
            </ul>

            <el-form>
                <el-form-item label="Destination address">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
        </div>

        <el-row justify="end">
            <el-col v-if="step != maxStep" :span="12">
                <el-button @click="step = maxStep" type="primary">Skip</el-button>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button v-if="step > 0" @click="step -= 1">Back</el-button>
                <el-button v-if="step != maxStep" @click="step += 1">Next</el-button>
                <el-button v-if="step == maxStep" type="success">Send to my wallet</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style scoped>
    .text-right {
        text-align:right;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
        text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
    }
</style>

<script>
    export default {
        name: "RedeemDialog",

        data() {
            return {
                step: 3,
                maxStep: 3,
            }
        },

        emits: [
            "back"
        ]
    }
</script>
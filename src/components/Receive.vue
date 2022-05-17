<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../SimplePay';
import Status from './Status.vue';
import QrCode from './QrCode.vue';
import { usePaymentStore } from '../store/payment';
import { storeToRefs } from 'pinia';

const paymentStore = usePaymentStore()
const { active, succeeded } = storeToRefs(paymentStore)
const { createNewPayment, saveSuccessfulPayment } = paymentStore


const props = defineProps<{
    requestAmount?: number
}>()

const paymentRequest = ref({} as PaymentRequest)
const paymentStatus = ref({} as PaymentResponse)
const address = ref('')
const requestAmount = ref(props.requestAmount || 0.001)

let paymentTracker

const generatePayment = async () => {
    clearPayment()
    paymentRequest.value = await simplePay.createPaymentRequest(requestAmount.value)

    createNewPayment(paymentRequest.value)
    address.value = paymentRequest.value.integratedAddress

    paymentTracker = setInterval(async () => {
        await checkPayment()
    }, 10000);
}

const checkPayment = async () => {
    paymentStatus.value = await simplePay.checkForPayment(paymentRequest.value)
    if (paymentStatus.value.paymentComplete) {
        saveSuccessfulPayment(paymentStatus.value)
        clearInterval(paymentTracker)
    }
}

const clearPayment = () => {
    paymentStatus.value = {} as PaymentResponse
    paymentRequest.value = {} as PaymentRequest
    clearInterval(paymentTracker)
}

onMounted(() => {
    if (props.requestAmount && props.requestAmount > 0) {
        generatePayment()
    }
})

</script>
<!-- TODO: refactor template if statements (cleanup needed!) -->
<template>
    <div v-if="!paymentRequest.integratedAddress">
        <el-row justify="center">
            {{ requestAmount }} XMR
        </el-row>
        <el-row justify="center">
            <el-input v-model="requestAmount" @keyup="clearPayment()" placeholder="Please input" />
        </el-row>
        <el-row justify="center">
            <el-button v-if="!paymentRequest.integratedAddress" type="success" @click="generatePayment">Generate
                Payment
            </el-button>
        </el-row>
    </div>
    <div v-if="paymentRequest.paymentUri">

        <el-row justify="center">
            <div v-if="paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming">Payment
                Found!
            </div>
            <div v-if="paymentStatus.paymentComplete">✅ Payment Complete!</div>
        </el-row>

        <el-row justify="center">
            <div v-if="paymentStatus && paymentRequest.integratedAddress">
                <p v-if="!paymentStatus.paymentComplete && paymentStatus.moneroTx">Current Confirmations: {{ paymentStatus.confirmations }}</p>
            </div>
        </el-row>
        <el-row justify="center">
            <QrCode :monero-uri="paymentRequest.paymentUri" />
        </el-row>
        <el-row justify="center">
            <p v-if="!paymentStatus.paymentComplete">Please send {{ requestAmount }} XMR to: </p>
        </el-row>
        <el-row justify="center">
            <p v-if="!paymentStatus.paymentComplete" class="monero">{{ paymentRequest.integratedAddress }}</p>
        </el-row>
        <el-row justify="center">
            <el-button v-if="paymentStatus.paymentComplete !== true" type="warning" @click="clearPayment">Cancel
                Payment
            </el-button>
            <el-button v-if="paymentStatus.paymentComplete === true" type="success" @click="clearPayment">Next
                Payment
            </el-button>
        </el-row>
    </div>

    <div v-if="paymentRequest.integratedAddress">
        <Status />
    </div>
</template>
<style>
.monero {
    word-break: break-word;
}
</style>
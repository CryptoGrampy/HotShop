<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../SimplePay';
import Status from './Status.vue';
import QrCode from './QrCode.vue';

const props = defineProps<{
  requestAmount?: number
}>()

console.log(props.requestAmount)

const paymentRequest = ref({} as PaymentRequest)
const paymentStatus = ref({} as PaymentResponse)
const address = ref('')
const requestAmount = ref(props.requestAmount || 0.001)

let paymentTracker

const generatePayment = async () => {
    clearPayment()
    paymentRequest.value = await simplePay.createPaymentRequest(requestAmount.value)
    console.log("Current Payment Request: ", paymentRequest.value)
    address.value = paymentRequest.value.integratedAddress

    paymentTracker = setInterval(async() => {
        await checkPayment()
    }, 10000);
}

const checkPayment = async () => {
    paymentStatus.value = await simplePay.checkForPayment(paymentRequest.value)
    console.log("Latest Payment Status: ", paymentStatus.value)
}

const clearPayment = () => {
    paymentStatus.value = {} as PaymentResponse
    paymentRequest.value = {} as PaymentRequest
    clearInterval(paymentTracker)
}

onMounted(() => {
    console.log('updated')
    if (props.requestAmount && props.requestAmount > 0) {
        generatePayment()
    }
})

</script>

<template>
    <p v-if="!paymentRequest.integratedAddress">
        Requested Amount: 
        <el-input v-model="requestAmount" @keyup="clearPayment()" placeholder="Please input" />
    </p>
    <p>
        <el-button v-if="!paymentRequest.integratedAddress" type="success" @click="generatePayment">Generate Payment</el-button>
    </p>

    <div v-if="paymentRequest.paymentUri">
        <p>
            <QrCode :monero-uri="paymentRequest.paymentUri" />
        </p>
        <p>Please send {{ requestAmount }} XMR to {{ paymentRequest.integratedAddress }}</p>
         <p>
        <el-button type="warning" @click="clearPayment">Cancel Payment</el-button>
    </p>
    </div>

    <div v-if="paymentRequest.integratedAddress && !paymentStatus.moneroTx">Waiting for Payment...</div>
    <div v-if="paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming">Payment Found! </div>
    <div v-if="paymentStatus.paymentComplete">✅ Payment Complete!</div>
    <div v-if="paymentStatus && paymentRequest.integratedAddress">

        <p>Your payment status is: {{ paymentStatus.paymentStatus ? paymentStatus.paymentStatus : 'Not detected' }}</p>
        <p
            v-if="paymentStatus.moneroTx"
        >Current Confirmations: {{ paymentStatus.confirmations }}</p>
    </div>

    <div v-if="paymentRequest.integratedAddress">
        <Status />
    </div>
</template>
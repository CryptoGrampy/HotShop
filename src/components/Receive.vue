<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse } from '../SimplePay';
import Status from './Status.vue';
import QrCode from './QrCode.vue';

const state = reactive({ count: 0 })

const paymentRequest = ref({} as PaymentRequest)
const paymentStatus = ref({} as PaymentResponse)
const address = ref('')
const walletInitialized = ref(false)
const requestAmount = ref(1000000)


const generatePayment = async () => {
    paymentRequest.value = await simplePay.createPaymentRequest(requestAmount.value)
    console.log("Current Payment Request: ", paymentRequest.value)
    address.value = paymentRequest.value.integratedAddress
}

const checkPayment = async () => {
    paymentStatus.value = await simplePay.checkForPaymentSuccess(paymentRequest.value)
    console.log("Latest Payment Status: ", paymentStatus.value)
}
</script>

<template>
    <p>
        <el-input v-model="requestAmount" placeholder="Please input" />
    </p>
    <p>
        <el-button type="success" @click="generatePayment">Generate Payment</el-button>
    </p>

    <div v-if="paymentRequest.integratedAddress">
        <p>
            <QrCode :monero-address="address" :xmr-amount="requestAmount" />
        </p>
        <p>Please send {{ simplePay.convertAtomicUnitsToXmr(String(requestAmount)) }} to {{ paymentRequest.integratedAddress }}</p>
    </div>

    <p>
        <el-button @click="checkPayment">Check Payment Status</el-button>
    </p>
    <div v-if="paymentStatus && paymentRequest.integratedAddress">
        <p>Your payment status is: {{ paymentStatus.paymentStatus ? paymentStatus.paymentStatus : 'Not detected' }}</p>
        <p
            v-if="paymentStatus.txData"
        >Current Confirmations: {{ paymentStatus.txData.data.confirmations }}</p>
    </div>

    <div v-if="paymentRequest.integratedAddress">
        <Status />
    </div>
</template>
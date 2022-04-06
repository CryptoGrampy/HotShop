<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse } from '../SimplePay';

const paymentStatus = ref({} as PaymentResponse)

// const checkPayment = async () => {
//     paymentStatus.value = await simplePay.checkForPaymentSuccess(paymentRequest.value)
//     console.log("Latest Payment Status: ", paymentStatus.value)
// }
</script>

<template>
</template>
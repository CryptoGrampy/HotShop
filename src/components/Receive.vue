<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../SimplePay';
import QrCode from './QrCode.vue';
import { usePaymentStore } from '../store/payment';
import { storeToRefs } from 'pinia';
import NumPad from './NumPad.vue';
import DisplayAmount from './DisplayAmount.vue';
import PaymentResult from './PaymentResult.vue';

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

const numPadAmount = ref('0')
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
    numPadAmount.value = '0'
    clearInterval(paymentTracker)
}

onMounted(() => {
    if (props.requestAmount && props.requestAmount > 0) {
        generatePayment()
    }
})

const onCurrentAmountChange = (val: string) => {
    numPadAmount.value = val
    requestAmount.value = Number(val)
}

</script>
<!-- TODO: refactor template if statements (cleanup needed!) -->
<template>

    <el-row justify="center">
        <el-col :span="24">
            <div
            v-if="!paymentStatus.paymentComplete && !(paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming)">
            <DisplayAmount :amount="paymentRequest.paymentUri ? String(requestAmount) : numPadAmount" symbol="ɱ" />
        </div>
        </el-col>
    </el-row>

    <div v-if="!paymentRequest.integratedAddress">
    <el-row justify="center">
        <NumPad :init-amount="numPadAmount" @currentAmountChange="onCurrentAmountChange" />
    </el-row>
        <el-row justify="center">
            <el-button :disabled="Number(numPadAmount) === 0" type="success" class="payment-button"
                v-if="!paymentRequest.integratedAddress" @click="generatePayment">
                Request
            </el-button>
        </el-row>
    </div>
    <div v-if="paymentRequest.paymentUri">
        <el-row justify="center">
            <el-col :span="24">
                <div v-if="paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming">Payment
                    Found. Confirming
                    {{ paymentStatus.confirmations }}/{{ paymentStatus.requestedPayment.requestedConfirmations }}.
                </div>
                <div v-if="paymentStatus.paymentComplete">
                    <el-result icon="success" title="Payment Received!" :sub-title="`You paid ${requestAmount} XMR`">
                    </el-result>
                </div>
            </el-col>
        </el-row>

        <el-row justify="center"
            v-if="!paymentStatus.paymentComplete && !(paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming)">
            <QrCode :monero-uri="paymentRequest.paymentUri" />
        </el-row>
        <el-row justify="center"
            v-if="!paymentStatus.paymentComplete && !(paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming)">
            <el-progress :show-text="false" :percentage="100" :indeterminate="true" :duration="5" />
        </el-row>

        <!-- <el-row justify="center"
            v-if="!paymentStatus.paymentComplete && !(paymentStatus.moneroTx && paymentStatus.paymentStatus === PaymentStatus.confirming)">
            <p v-if="!paymentStatus.paymentComplete" class="monero">{{ paymentRequest.integratedAddress }}</p>
        </el-row> -->
        <el-row justify="center">
            <el-button class="payment-button" v-if="paymentStatus.paymentComplete !== true" type="warning"
                @click="clearPayment">Cancel
                Payment
            </el-button>
            <el-button class="payment-button" v-if="paymentStatus.paymentComplete === true" type="success"
                @click="clearPayment">Next
                Payment
            </el-button>
        </el-row>
    </div>

</template>
<style scoped>
.el-progress--line {
    margin: 15px 0 30px;
    width: 100%;
    max-width: 300px;
}

.payment-button {
    font-size: 20px;
    text-align: center;
    border-radius: 20px;
    padding: 20px;
    width: 250px;
}

.monero {
    word-break: break-word;
}
</style>
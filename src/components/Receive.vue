<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../SimplePay';
import QrCode from './QrCode.vue';
import { usePaymentStore } from '../store/payment';
import { storeToRefs } from 'pinia';
import NumPad from './NumPad.vue';
import DisplayAmount from './DisplayAmount.vue';
import { exchangeCurrency, exchangeCurrencyStatus, CurrencyOption, stopTrackingRate, trackExchangeRate } from '../store/currency';
import { useConfigStore } from '../store/hot-shop-config';
import { computed } from '@vue/reactivity';

const paymentStore = usePaymentStore()
const configStore = useConfigStore()
const { active, succeeded } = storeToRefs(paymentStore)
const { createNewPayment, saveSuccessfulPayment } = paymentStore

const { user } = storeToRefs(configStore)

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
    }, 2000);
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

    trackExchangeRate(CurrencyOption[String(user?.value?.exchangeCurrency)])
})

const showPaymentScreen = computed(() => {
    return paymentRequest.value.paymentUri ? true : false
})

const displayPaymentInfo = computed(() => {
    return (!paymentStatus.value.paymentComplete && !(paymentStatus.value.moneroTx && paymentStatus.value.paymentStatus === PaymentStatus.confirming))
})

const secondaryDisplayAmount = computed(() => {
    if (exchangeCurrency.value?.exchangeRate && exchangeCurrencyStatus && paymentRequest.value.paymentUri) {
        return `${exchangeCurrency.value?.symbol}${(exchangeCurrency.value.exchangeRate * requestAmount.value).toFixed(2)}`
    } else if (exchangeCurrency.value?.exchangeRate && exchangeCurrencyStatus) {
        return `${exchangeCurrency.value?.symbol}${(exchangeCurrency.value.exchangeRate * Number(numPadAmount.value)).toFixed(2)}`
    }
})

const onCurrentAmountChange = (val: string) => {
    numPadAmount.value = val
    requestAmount.value = Number(val)
}

onBeforeUnmount(() => {
    stopTrackingRate()
})

</script>
<!-- TODO: refactor template if statements and really nasty numpad / request amount stuff -->
<template>
    <!-- if display xmr only or if exchange API is down -->
    <div v-if="user?.exchangeCurrency === CurrencyOption.NONE || !exchangeCurrencyStatus">
        <el-row justify="center">
            <el-col :span="24">
                <div v-if="displayPaymentInfo">
                    <DisplayAmount :amount="paymentRequest.paymentUri ? String(requestAmount) : numPadAmount"
                        symbol="ɱ" />
                </div>
            </el-col>
        </el-row>
    </div>
    <!-- if exchangeCurrency and exchangeCurrencyStatus -->
    <div v-if="user?.exchangeCurrency !== CurrencyOption.NONE && exchangeCurrencyStatus">
        <div v-if="displayPaymentInfo">
            <el-row justify="center">
                <el-col :span="24">
                    <DisplayAmount :amount="paymentRequest.paymentUri ? String(requestAmount) : numPadAmount"
                        symbol="ɱ" />
                </el-col>
            </el-row>
            <el-row justify="center">
                <p class="exchange-currency">
                    {{ secondaryDisplayAmount }}
                </p>
            </el-row>
            <!-- <el-row justify="center">
                <p class="exchange-currency"
                    v-if="exchangeCurrency && exchangeCurrency.exchangeRate && exchangeCurrency.symbol">
                    ~{{ exchangeCurrency.symbol }}
                    <span v-if="paymentRequest && paymentRequest.paymentUri && exchangeCurrency && exchangeCurrency.exchangeRate && requestAmount">{{ (exchangeCurrency.exchangeRate * requestAmount).toFixed(2)}}</span>
                    <span v-if="!paymentRequest?.paymentUri && exchangeCurrency && exchangeCurrency.exchangeRate && numPadAmount">{{ (exchangeCurrency.exchangeRate * Number(numPadAmount)).toFixed(2)}}</span>
                </p>
            </el-row> -->
        </div>
    </div>

    <div v-if="!showPaymentScreen">
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

    <div v-if="showPaymentScreen">
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

        <el-row justify="center" v-if="displayPaymentInfo && paymentRequest.paymentUri">
            <QrCode :address="paymentRequest.integratedAddress" :monero-uri="paymentRequest.paymentUri" />
        </el-row>
        <el-row justify="center" v-if="displayPaymentInfo">
            <el-progress :show-text="false" :percentage="100" :indeterminate="true" :duration="5" />
        </el-row>
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
.exchange-currency {
    font-weight: bold;
}

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
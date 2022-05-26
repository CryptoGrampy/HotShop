<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { simplePay } from '../main';
import { PaymentStatus } from '../SimplePay';
import QrCode from './QrCode.vue';
import { usePaymentStore } from '../store/payment';
import { storeToRefs } from 'pinia';
import NumPad from './NumPad.vue';
import DisplayAmount from './DisplayAmount.vue';
import { exchangeCurrency, exchangeCurrencyStatus, CurrencyOption, stopTrackingRate, trackExchangeRate, currencies } from '../store/currency';
import { useConfigStore } from '../store/hot-shop-config';
import { computed } from '@vue/reactivity';
import { ElMessage } from 'element-plus';

const props = defineProps<{
    quickPayAmount?: number
}>()

const paymentStore = usePaymentStore()
const { activeRequest, activeStatus, numPadAmount } = storeToRefs(paymentStore)
const { saveSuccessfulPayment, clearActiveRequest } = paymentStore

const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

const currentXmrAmount = computed(() => {
    if (activeRequest.value.requestAmount > 0) {
        return activeRequest.value.requestAmount
    }
    const currentNumpadValue = Number(numPadAmount.value)
    if (exchangeCurrency.value.symbol !== CurrencyOption.NONE && currentNumpadValue > 0 && exchangeCurrencyStatus && exchangeCurrency.value?.exchangeRate > 0) {
        if (user?.value?.useExchangeAsPrimary) {
            return Number((currentNumpadValue / exchangeCurrency.value?.exchangeRate).toFixed(12))
        }
    }

    return currentNumpadValue
})


let paymentTrackerIntervalRef


const generatePayment = async () => {
    clearInterval(paymentTrackerIntervalRef)

    activeRequest.value = await simplePay.createPaymentRequest(currentXmrAmount.value)

    paymentTrackerIntervalRef = setInterval(async () => {
        await checkPayment()
    }, 2000);
}

const checkPayment = async () => {
    activeStatus.value = await simplePay.checkForPayment(activeRequest.value)

    if (activeStatus.value.paymentComplete) {
        saveSuccessfulPayment(activeStatus.value)
        clearInterval(paymentTrackerIntervalRef)
    }
}

const clearPayment = () => {
    clearInterval(paymentTrackerIntervalRef)
    clearActiveRequest()
}

onMounted(() => {
    if (props.quickPayAmount && props.quickPayAmount > 0) {
        generatePayment()
    }

    trackExchangeRate(CurrencyOption[String(user?.value?.exchangeCurrency)])
})

onBeforeUnmount(() => {
    clearPayment()
})

const showPaymentScreen = computed(() => {
    return activeRequest.value.paymentUri ? true : false
})

const displayPaymentInfo = computed(() => {
    return (!activeStatus.value.paymentComplete && !(activeStatus.value.moneroTx && activeStatus.value.paymentStatus === PaymentStatus.confirming))
})

const subDisplayAmount = computed(() => {
    if (exchangeCurrencyStatus && exchangeCurrency.value?.exchangeRate) {
        if (user?.value?.useExchangeAsPrimary) {
            const reqAmount = activeRequest.value.requestAmount

            if (reqAmount > 0) {
                return `${currencies[CurrencyOption.XMR].symbol}${reqAmount}`
            } else {
                const value = Number(numPadAmount.value) > 0 ? Number((Number(numPadAmount.value) / exchangeCurrency.value?.exchangeRate).toFixed(12)) : 0
                return `${currencies[CurrencyOption.XMR].symbol}${value}`
            }
        } else {
            return `~${exchangeCurrency.value?.symbol}${(exchangeCurrency.value.exchangeRate * currentXmrAmount.value).toFixed(2)}`
        }
    }
})

const onCurrentAmountChange = (val: string) => {
    numPadAmount.value = val
}

const openMessage = () => {
    ElMessage({
        message: 'XMR amount copied!',
        type: 'success',
    })
}

const clipboardData = navigator.clipboard

const copyToClipboard = () => {
    if (showPaymentScreen.value) {
        clipboardData.writeText(String(activeRequest.value.requestAmount));
        openMessage()
    }
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
                <div @click="copyToClipboard" v-if="displayPaymentInfo">
                    <DisplayAmount
                        :amount="quickPayAmount && quickPayAmount > 0 ? String(quickPayAmount) : numPadAmount"
                        symbol="ɱ" />
                </div>
            </el-col>
        </el-row>
    </div>
    <!-- if exchangeCurrency and exchangeCurrencyStatus -->
    <div v-if="user?.exchangeCurrency !== CurrencyOption.NONE && exchangeCurrencyStatus">
        <div @click="copyToClipboard" v-if="displayPaymentInfo">
            <el-row justify="center">
                <el-col :span="24">
                    <DisplayAmount
                        :amount="quickPayAmount && quickPayAmount > 0 ? String(quickPayAmount) : numPadAmount"
                        :symbol="user?.useExchangeAsPrimary ? exchangeCurrency!.symbol : currencies[CurrencyOption.XMR].symbol" />
                </el-col>
            </el-row>
            <el-row justify="center">
                <p class="exchange-currency">
                    ({{ subDisplayAmount }})
                </p>
            </el-row>
        </div>
    </div>

    <div v-if="!showPaymentScreen">
        <el-row justify="center">
            <NumPad :init-amount="numPadAmount" @currentAmountChange="onCurrentAmountChange" />
        </el-row>
        <el-row justify="center">
            <el-button :disabled="Number(numPadAmount) === 0" type="success" class="payment-button"
                v-if="!activeRequest.integratedAddress" @click="generatePayment">
                Request
            </el-button>
        </el-row>
    </div>

    <div v-if="showPaymentScreen">
        <el-row justify="center">
            <el-col :span="24">
                <div v-if="activeStatus.paymentStatus === PaymentStatus.confirming">
                    <el-result icon="info" title="Payment Detected! Confirming..."
                        :sub-title="`Current Confirmations: ${activeStatus.confirmations} / ${activeStatus.requestedPayment.requestedConfirmations}`">
                    </el-result>
                </div>
                <div v-if="activeStatus.paymentComplete === true">
                    <el-result icon="success" title="Payment Received!"
                        :sub-title="`You paid ${activeRequest.requestAmount} XMR`">
                    </el-result>
                </div>
            </el-col>
        </el-row>

        <el-row justify="center" v-if="displayPaymentInfo && activeRequest.paymentUri">
            <QrCode :address="activeRequest.integratedAddress" :monero-uri="activeRequest.paymentUri" />
        </el-row>
        <el-row justify="center" v-if="displayPaymentInfo">
            <el-progress :show-text="false" :percentage="100" :indeterminate="true" :duration="5" />
        </el-row>
        <el-row justify="center">
            <el-button class="payment-button" v-if="activeStatus.paymentComplete !== true" type="warning"
                @click="clearPayment">Cancel
                Payment
            </el-button>
            <el-button class="payment-button" v-if="activeStatus.paymentComplete === true" type="success"
                @click="clearPayment">Next
                Payment
            </el-button>
        </el-row>
    </div>

</template>
<style scoped>
.exchange-currency {
    font-weight: bold;
    margin-top: 0;
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
<script setup lang="ts">
import { onBeforeUnmount, onMounted, defineProps, watch } from "vue";
import { simplePay } from "../main";
import { PaymentStatus } from "../SimplePay";
import QrCode from "./QrCode.vue";
import { usePaymentStore } from "../store/payment";
import { storeToRefs } from "pinia";
import NumPad from "./NumPad.vue";
import DisplayAmount from "./DisplayAmount.vue";
import {
  exchangeCurrency,
  exchangeCurrencyStatus,
  CurrencyOption,
  stopTrackingRate,
  trackExchangeRate,
  currencies,
} from "../store/currency";
import { useConfigStore } from "../store/hot-shop-config";
import { computed } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import { DCaret } from "@element-plus/icons-vue";

const props = defineProps<{
  quickPayAmount?: number;
}>();

const paymentStore = usePaymentStore();
const { activeRequest, activeStatus, numPadAmount } = storeToRefs(paymentStore);
const { saveSuccessfulPayment, clearActiveRequest } = paymentStore;

const configStore = useConfigStore();
const { user } = storeToRefs(configStore);

const currentXmrAmount = computed(() => {
  if (activeRequest.value.requestAmount > 0) {
    return activeRequest.value.requestAmount;
  }
  const currentNumpadValue = Number(numPadAmount.value);
  if (
    exchangeCurrency.value.symbol !== CurrencyOption.NONE &&
    currentNumpadValue > 0 &&
    exchangeCurrencyStatus &&
    exchangeCurrency.value?.exchangeRate > 0
  ) {
    if (user?.value?.useExchangeAsPrimary) {
      return Number(
        (currentNumpadValue / exchangeCurrency.value?.exchangeRate).toFixed(12)
      );
    }
  }

  return currentNumpadValue;
});

let paymentTrackerIntervalRef;

const generatePayment = async () => {
  clearInterval(paymentTrackerIntervalRef);

  const label =
    user?.value?.shopName && user.value.shopName.trim().length > 0
      ? user?.value?.shopName
      : "HotShop";
  activeRequest.value = await simplePay.createPaymentRequest(
    currentXmrAmount.value,
    label
  );

  paymentTrackerIntervalRef = setInterval(async () => {
    await checkPayment();
  }, 3000);
};

const checkPayment = async () => {
  activeStatus.value = await simplePay.checkForPayment(activeRequest.value);

  if (activeStatus.value.paymentComplete) {
    saveSuccessfulPayment(activeStatus.value);
    clearInterval(paymentTrackerIntervalRef);
  }
};

const clearPayment = () => {
  clearInterval(paymentTrackerIntervalRef);
  clearActiveRequest();
};

onMounted(() => {
  if (props.quickPayAmount && props.quickPayAmount > 0) {
    generatePayment();
  }
  trackExchangeRate(CurrencyOption[String(user?.value?.exchangeCurrency)]);
});

onBeforeUnmount(() => {
  clearPayment();
});

watch(user, (newUser, oldUser) => {
  if (newUser.exchangeCurrency !== oldUser.exchangeCurrency) {
    trackExchangeRate(CurrencyOption[String(user?.value?.exchangeCurrency)]);
  }
});

const showPaymentScreen = computed(() => {
  return activeRequest.value.paymentUri ? true : false;
});

const displayPaymentInfo = computed(() => {
  return (
    !activeStatus.value.paymentComplete &&
    !(
      activeStatus.value.moneroTx &&
      activeStatus.value.paymentStatus === PaymentStatus.confirming
    )
  );
});

const subDisplayAmount = computed(() => {
  if (exchangeCurrencyStatus && exchangeCurrency.value?.exchangeRate) {
    if (user?.value?.useExchangeAsPrimary) {
      const reqAmount = activeRequest.value.requestAmount;

      if (reqAmount > 0) {
        return `${currencies[CurrencyOption.XMR].symbol}${reqAmount}`;
      } else {
        const value =
          Number(numPadAmount.value) > 0
            ? Number(
                (
                  Number(numPadAmount.value) /
                  exchangeCurrency.value?.exchangeRate
                ).toFixed(12)
              )
            : 0;
        return `${currencies[CurrencyOption.XMR].symbol}${value}`;
      }
    } else {
      return `~${exchangeCurrency.value?.symbol}${(
        exchangeCurrency.value.exchangeRate * currentXmrAmount.value
      ).toFixed(2)}`;
    }
  }
});

const swapMainAndSubDisplayCurrencies = () => {
  if (
    exchangeCurrency.value &&
    exchangeCurrencyStatus.value &&
    user?.value &&
    !showPaymentScreen.value
  ) {
    clearPayment();
    user.value.useExchangeAsPrimary = !user.value.useExchangeAsPrimary;
  }
};

const onCurrentAmountChange = (val: string) => {
  numPadAmount.value = val;
};

const openMessage = () => {
  ElMessage({
    message: "XMR amount copied!",
    type: "success",
  });
};

const clipboardData = navigator.clipboard;

const copyToClipboard = () => {
  if (showPaymentScreen.value) {
    clipboardData.writeText(String(activeRequest.value.requestAmount));
    openMessage();
  }
};

onBeforeUnmount(() => {
  stopTrackingRate();
});
</script>
<!-- TODO: refactor template if statements and really nasty numpad / request amount stuff -->
<template>
  <!-- if display xmr only or if exchange API is down -->
  <div
    v-if="
      user?.exchangeCurrency === CurrencyOption.NONE || !exchangeCurrencyStatus
    "
  >
    <el-row justify="center">
      <el-col :span="24">
        <div v-if="displayPaymentInfo" @click="copyToClipboard">
          <DisplayAmount
            :amount="
              quickPayAmount && quickPayAmount > 0
                ? String(quickPayAmount)
                : numPadAmount
            "
            symbol="ɱ"
          />
        </div>
      </el-col>
    </el-row>
  </div>
  <div
    v-if="
      user?.exchangeCurrency !== CurrencyOption.NONE && exchangeCurrencyStatus
    "
  >
    <div v-if="displayPaymentInfo" @click="copyToClipboard">
      <el-row justify="center">
        <el-col :span="24">
          <DisplayAmount
            :amount="
              quickPayAmount && quickPayAmount > 0
                ? String(quickPayAmount)
                : numPadAmount
            "
            :symbol="
              user?.useExchangeAsPrimary
                ? exchangeCurrency.symbol
                : currencies[CurrencyOption.XMR].symbol
            "
          />
        </el-col>
      </el-row>
      <el-row justify="center" align="middle" class="sub-display">
        <span
          class="exchange-currency"
          @click="swapMainAndSubDisplayCurrencies"
        >
          {{ subDisplayAmount }}
        </span>
        <el-icon
          v-if="!showPaymentScreen"
          size="10"
          @click="swapMainAndSubDisplayCurrencies"
        >
          <DCaret class="caret" />
        </el-icon>
      </el-row>
    </div>
  </div>

  <div v-if="!showPaymentScreen">
    <el-row justify="center">
      <NumPad
        :init-amount="numPadAmount"
        @current-amount-change="onCurrentAmountChange"
      />
    </el-row>
    <el-row justify="center">
      <el-button
        v-if="!activeRequest.integratedAddress"
        :disabled="Number(numPadAmount) === 0"
        type="success"
        class="payment-button"
        @click="generatePayment"
      >
        Request
      </el-button>
    </el-row>
  </div>

  <div v-if="showPaymentScreen">
    <el-row justify="center">
      <el-col :span="24">
        <div v-if="activeStatus.paymentStatus === PaymentStatus.confirming">
          <el-result
            icon="info"
            title="Payment Detected! Confirming..."
            :sub-title="`Current Confirmations: ${activeStatus.confirmations} / ${activeStatus.requestedPayment.requestedConfirmations}`"
          >
          </el-result>
        </div>
        <div v-if="activeStatus.paymentComplete === true">
          <el-result
            icon="success"
            title="Payment Received!"
            :sub-title="`You paid ${activeRequest.requestAmount} XMR`"
          >
          </el-result>
        </div>
      </el-col>
    </el-row>

    <el-row
      v-if="displayPaymentInfo && activeRequest.paymentUri"
      justify="center"
    >
      <QrCode
        :address="activeRequest.integratedAddress"
        :monero-uri="activeRequest.paymentUri"
      />
    </el-row>
    <el-row v-if="displayPaymentInfo" justify="center">
      <el-progress
        :show-text="false"
        :percentage="100"
        :indeterminate="true"
        :duration="5"
      />
    </el-row>
    <el-row justify="center">
      <el-button
        v-if="activeStatus.paymentComplete !== true"
        class="payment-button"
        type="warning"
        @click="clearPayment"
        >Cancel Payment
      </el-button>
      <el-button
        v-if="activeStatus.paymentComplete === true"
        class="payment-button"
        type="success"
        @click="clearPayment"
        >Next Payment
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

.sub-display {
  margin-bottom: 20px;
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

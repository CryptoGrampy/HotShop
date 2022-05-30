<script setup lang="ts">
import { useConfigStore } from "../store/hot-shop-config";
import { ref } from "vue";
import { simplePay } from "../main";
import { Network, simplePayReady } from "../SimplePay";
import { storeToRefs } from "pinia";
import { currencies, CurrencyOption } from "../store/currency";
import { ElMessage } from "element-plus";

/**
 * The goal of this component is to:
 * Load user settings from the store into the form fields
 * Allow the user to make changes WITHOUT updating the store
 * Validate user changes as they are being made
 * Give the user a button to press to enact those changes
 * Changes get pushed to the store (and form fields are updated)
 * Node is restared with the new updates
 * User is provided with fresh set of HotShop links and is alerted to update their bookmarks using the new links
 *
 */
const configStore = useConfigStore();

// static values from store
const currentStoreUrl = ref(configStore.myHotShopUrl);

// ref values from store
const { myHotShopUrl } = storeToRefs(configStore);

const settingsForm = ref({
  payment: {
    ...configStore.payment,
  },
  user: {
    ...configStore.user,
  },
});

const settingsUpdatedMessage = () => {
  ElMessage({
    message: "Settings changed!  Please update your HotShop bookmark.",
    type: "success",
  });
};

const updateSettings = async () => {
  /**
   * Validate if necessary
   * update store config
   * store should update simplepay on change
   * update shop url
   */

  simplePayReady.value = false;
  configStore.$state = settingsForm.value;
  currentStoreUrl.value = myHotShopUrl.value;
  await simplePay.updateConfig(configStore.$state.payment);
  settingsUpdatedMessage();
};
</script>

<template>
  <p>
    <el-link type="primary" :href="currentStoreUrl"
      >My Custom HotShop Shop URL (Add this link to your bookmarks!)
    </el-link>
  </p>
  <p>
    Network:
    <el-select v-model="settingsForm.payment.network" placeholder="Select">
      <el-option
        v-for="item in Network"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </p>

  <p>
    Web-Compatible Monerod Address
    <el-link>
      (<router-link to="/node-checker"
        >Test with the Node Compatibility Tool</router-link
      >)
    </el-link>
    <el-input
      v-model="settingsForm.payment.monerodUri"
      placeholder="Please input your Monerod address (note Mainnet/Stagenet)"
    />
  </p>

  <p>
    Monerod Username (Optional)
    <el-input
      v-model="settingsForm.payment.monerodUsername"
      placeholder="Please input your Username"
    />
  </p>

  <p>
    Monerod Password (Optional)
    <el-input
      v-model="settingsForm.payment.monerodPassword"
      placeholder="Please input your Password"
    />
  </p>

  <p>
    Primary Address:
    <el-input
      v-model="settingsForm.payment.primaryAddress"
      placeholder="Please input your Primary Address"
    />
  </p>

  <p>
    View Key:
    <el-input
      v-model="settingsForm.payment.secretViewKey"
      placeholder="Please input your secret View Key"
    />
  </p>

  <p>
    Confirmations:
    <el-input
      v-model="settingsForm.payment.defaultConfirmations"
      placeholder="Please input your desired transaction confirmations (higher = slower confirmation)"
    />
  </p>

  <p>
    Logo URL:
    <el-input
      v-model="settingsForm.user.logoUrl"
      placeholder="Please input your custom logo URL"
    />
  </p>

  <p>
    Exchange Currency:
    <el-select
      v-model="settingsForm.user.exchangeCurrency"
      placeholder="Select"
    >
      <el-option
        :label="currencies[CurrencyOption.NONE].displayName"
        :value="currencies[CurrencyOption.NONE].ticker"
      />
      <el-option
        :label="currencies[CurrencyOption.USD].displayName"
        :value="currencies[CurrencyOption.USD].ticker"
      />
      <el-option
        :label="currencies[CurrencyOption.EUR].displayName"
        :value="currencies[CurrencyOption.EUR].ticker"
      />
    </el-select>
  </p>

  <p v-if="settingsForm.user.exchangeCurrency !== CurrencyOption.NONE">
    <el-checkbox
      v-model="settingsForm.user.useExchangeAsPrimary"
      placeholder="Select"
      label="Use Exchange Currency as Primary"
    />
  </p>

  <p>
    Shop Name:
    <el-input
      v-model="settingsForm.user.shopName"
      placeholder="Please input your custom shop Name"
    />
  </p>

  <el-button type="primary" @click="updateSettings">Update Settings</el-button>
</template>

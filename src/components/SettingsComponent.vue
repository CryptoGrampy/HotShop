<script setup lang="ts">
import { useConfigStore } from "../store/hot-shop-config";
import { reactive, ref, watch } from "vue";
import { simplePay } from "../main";
import { Network, simplePayReady } from "../SimplePay";
import { storeToRefs } from "pinia";
import { currencies, CurrencyOption } from "../store/currencies";
import { ElMessage } from "element-plus";
import {
  User,
  Monitor,
  Money,
  Cpu,
  PriceTag,
  Link,
} from "@element-plus/icons-vue";
import { update } from "idb-keyval";

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
const { myHotShopUrl, myKioskUrl, payment, user } = storeToRefs(configStore);

const settingsForm = reactive({
  payment: { ...payment.value },
  user: { ...user.value },
});

watch(payment, (newPayment) => {
  settingsForm.payment = newPayment;
});

watch(user, (newUser) => {
  settingsForm.user = newUser;
});

const settingsUpdatedMessage = () => {
  ElMessage({
    message:
      "Settings changed!  Please re-bookmark your HotShop Admin and Kiosk links.",
    type: "success",
  });
};

const updateSettings = async () => {
  simplePayReady.value = false;
  configStore.$state = settingsForm;
  currentStoreUrl.value = myHotShopUrl.value;
  await simplePay.updateConfig(configStore.$state.payment);
  await update("config", () => JSON.stringify(settingsForm));
  settingsUpdatedMessage();
};
</script>

<template>
  <h2>Settings</h2>

  <h3>
    <el-space>
      <el-icon class="settings-icon" :size="30">
        <Money />
      </el-icon>
      Wallet
    </el-space>
  </h3>
  <el-form :model="settingsForm" label-width="120px" label-position="top">
    <el-form-item label="Primary Address">
      <el-input
        v-model="settingsForm.payment.primaryAddress"
        placeholder="49ouNFXbQxj72FYjEgRjVTa35dHVrSL118vNFhxDvQWHJYpZp523EckbrqiSjM6Vb1H6Ap43qYpNRHBaVS9oBFtZUeTaH88"
      />
    </el-form-item>
    <el-form-item label="Secret View Key">
      <el-input
        v-model="settingsForm.payment.secretViewKey"
        placeholder="9fb781ad709a41bd651f92c2e380813b9ca8abfb7e733105202e1d9f12799c03"
      />
    </el-form-item>

    <h3>
      <el-space>
        <el-icon class="settings-icon" :size="30">
          <Cpu />
        </el-icon>
        Monero Node
      </el-space>
    </h3>

    <el-form-item label="Web-Compatible Node Address (Must include port)">
      <el-input
        v-model="settingsForm.payment.monerodUri"
        placeholder="https://community.organic-meatballs.duckdns.org:443"
      />
    </el-form-item>
    <el-form-item label="Username">
      <el-input
        v-model="settingsForm.payment.monerodUsername"
        placeholder="myNodeUsername1234"
      />
    </el-form-item>
    <el-form-item label="Password">
      <el-input
        v-model="settingsForm.payment.monerodPassword"
        type="password"
        placeholder="mySecretPassw0rd!"
      />
    </el-form-item>

    <el-form-item label="Confirmations (higher = slower confirmation)">
      <el-input
        v-model="settingsForm.payment.defaultConfirmations"
        type="number"
        placeholder="0"
      />
    </el-form-item>

    <el-form-item label="Network">
      <el-select v-model="settingsForm.payment.network" placeholder="Select">
        <el-option
          v-for="item in Network"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <h3>
      <el-space>
        <el-icon class="settings-icon" :size="30">
          <PriceTag />
        </el-icon>
        Shop
      </el-space>
    </h3>

    <el-form-item label="Shop Name / Payment QR Text">
      <el-input v-model="settingsForm.user.shopName" placeholder="My Store" />
    </el-form-item>
    <el-form-item>
      <el-checkbox
        v-model="settingsForm.user.displayShopName"
        placeholder="Select"
        label="Display Shop Name Text"
      />
    </el-form-item>

    <el-form-item label="Custom Logo URL">
      <el-input
        v-model="settingsForm.user.logoUrl"
        placeholder="www.website.com/my-store-logo.jpg"
      />
    </el-form-item>

    <el-form-item label="Exchange Currency">
      <el-select
        v-model="settingsForm.user.exchangeCurrency"
        filterable
        placeholder="Select"
      >
        <el-option
          v-for="currency in currencies"
          v-bind:key="currency.displayName"
          :label="currency.displayName"
          :value="currency.ticker"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="settingsForm.user.exchangeCurrency !== CurrencyOption.NONE"
    >
      <el-checkbox
        v-model="settingsForm.user.useExchangeAsPrimary"
        placeholder="Select"
        label="Use Exchange Currency as Primary"
      />
    </el-form-item>

    <el-button type="primary" @click="updateSettings"
      >Update Settings</el-button
    >
  </el-form>

  <h3>
    <el-space>
      <el-icon class="settings-icon" :size="30"> <Link /> </el-icon>
      My Custom HotShop Links
    </el-space>
  </h3>

  <el-row>
    <el-tooltip placement="right">
      <template #content
        >Your custom HotShop Admin URL<br />- Use for updating settings.<br />-
        Use as your main PoS link if you're not concerned about customers
        accessing your settings. <br />- Make sure to re-bookmark after updating
        settings.</template
      >
      <el-link type="primary" :href="currentStoreUrl">
        <el-icon class="url-icon" :size="18"> <User /> </el-icon>Admin URL
      </el-link>
    </el-tooltip>
  </el-row>
  <p>
    <el-tooltip placement="right">
      <template #content
        >The Kiosk version of your HotShop <br />- Settings button hidden and
        links disabled. <br />
        - Bookmark this link for kiosk mode. <br />- Make sure to re-bookmark
        after updating settings.</template
      >
      <el-link type="primary" :href="myKioskUrl">
        <el-icon class="url-icon" :size="18">
          <Monitor />
        </el-icon>
        Kiosk URL
      </el-link>
    </el-tooltip>
  </p>
</template>
<style scoped>
.url-icon {
  padding-bottom: 4px;
  margin-right: 5px;
}
</style>

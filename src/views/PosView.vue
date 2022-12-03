<script setup lang="ts">
import ReceiveComponent from "../components/ReceiveComponent.vue";
import {
  monerodConnectionStatusText,
  simplePayReady,
} from "../SimplePay";
import HeaderComponent from "../components/HeaderComponent.vue";
import { computed } from "@vue/reactivity";


const statusText = computed(() => {
  if (simplePayReady.value === true) {
    return false;
  } else {
    return { text: monerodConnectionStatusText.value };
  }
});
</script>

<template>
  <HeaderComponent />
  <el-row v-loading="statusText" justify="center">
    <el-col :span="24">
      <ReceiveComponent />
    </el-col>
  </el-row>
</template>

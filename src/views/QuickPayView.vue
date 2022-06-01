<script setup lang="ts">
import ReceiveComponent from "../components/ReceiveComponent.vue";
import { simplePayReady } from "../SimplePay";

const props = defineProps<{
  requestAmount: string;
}>();
</script>

<template>
  <h2>Hello, Quick(ish)Pay</h2>
  <div v-if="simplePayReady">
    <ReceiveComponent :quick-pay-amount="Number(props.requestAmount)" />
  </div>

  <div v-if="!simplePayReady">
    Rolling up windows. Please wait... (may take a minute or so)
  </div>
</template>

<style scoped>
body {
  word-wrap: break-word;
}
</style>

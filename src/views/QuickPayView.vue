<script setup lang="ts">
import Receive from '../components/Receive.vue';
import { simplePayReady } from '../SimplePay';

const props = defineProps<{
  requestAmount: string
}>()

</script>

<template>
    <h2>Hello, Quick(ish)Pay</h2>
    <div v-if="simplePayReady">
      <Receive :quick-pay-amount="Number(props.requestAmount)"/>
    </div>

    <div v-if="!simplePayReady">Rolling up windows.  Please wait... (may take a minute or so)</div>
</template>

<style scoped>
body {
    word-wrap: break-word;
}
</style>
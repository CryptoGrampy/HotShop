<script setup lang="ts">
import { simplePay } from '../main';
import VueQrcode from '@chenfengyuan/vue-qrcode';

const props = defineProps<{
  moneroAddress: string
  xmrAmount: number
}>()

const qrValue = `monero:${props.moneroAddress}?tx_amount=${String(simplePay.convertAtomicUnitsToXmr(String(props.xmrAmount)))}`
</script>
<template>
  <vue-qrcode :value="qrValue" :options="{ width: 200 }"></vue-qrcode>
</template>
<script setup lang="ts">
import VueQrious from 'vue-qrious'
import { simplePay } from '../main';

const props = defineProps<{
  moneroAddress: string
  xmrAmount: number
}>()

</script>
<template>
    <vue-qrious :size="200" :value="`monero:${props.moneroAddress}?tx_amount=${String(simplePay.convertAtomicUnitsToXmr(String(props.xmrAmount)))}`" />
</template>
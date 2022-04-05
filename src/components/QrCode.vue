<script setup lang="ts">
import VueQrious from 'vue-qrious'
const props = defineProps<{
  moneroAddress: string
  xmrAmount: number
}>()

</script>
<template>
    <vue-qrious :size="200" :value="`monero:${props.moneroAddress}?tx_amount=${String(props.xmrAmount)}`" />
</template>
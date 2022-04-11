<script setup lang="ts">
import VueQrcode from '@chenfengyuan/vue-qrcode';

const props = defineProps<{
  moneroUri: string
}>()

</script>
<template>
  <vue-qrcode :value="props.moneroUri" :options="{ width: 200 }"></vue-qrcode>
</template>
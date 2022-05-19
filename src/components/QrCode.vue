<script setup lang="ts">
import { useConfigStore } from '../store/hot-shop-config';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { storeToRefs } from 'pinia';

const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

const props = defineProps<{
  moneroUri: string
}>()

</script>
<template>
  <figure>
    <vue-qrcode :value="props.moneroUri" :options="{
      width: 200,
      errorCorrectionLevel: 'Q',
    }"></vue-qrcode>
    <img class="qrcode__image" :src="user?.logoUrl" alt="">
  </figure>
</template>
<style scoped>

figure {
  margin: 10px 0 0;
  padding: 0;
}
.qrcode {
  position: relative;
}
.qrcode__image {
  background-color: white;
  border-radius: 0.30rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 30px;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
}
</style>
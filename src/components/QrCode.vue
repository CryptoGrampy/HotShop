<script setup lang="ts">
import { useConfigStore } from '../store/hot-shop-config';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus'

const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

const props = defineProps<{
  moneroUri: string
  address: string
}>()

const openMessage = () => {
  ElMessage({
    message: 'Address copied!',
    type: 'success',
  })
}

const clipboardData = navigator.clipboard

const copyToClipboard = () => {
  clipboardData.writeText(props.address);
  openMessage()
}

</script>
<template>
  <!-- todo: wrap this in a clickable monero uri link ? -->
  <figure @click="copyToClipboard">
    <vue-qrcode :value="props.moneroUri" :options="{
      width: 200,
      errorCorrectionLevel: 'Q',
    }"></vue-qrcode>
    <!-- todo: use local monero asset for image logo -->
    <img class="qrcode__image" :src="user?.logoUrl" alt="">
  </figure>
</template>
<style scoped>
figure {
  margin: 10px 0 0;
  padding: 0;
}

figure:hover {
  cursor: pointer;
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
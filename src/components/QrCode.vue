<script setup lang="ts">
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { ElMessage } from "element-plus";
import { defineProps } from "vue";

const props = defineProps({
  moneroUri: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
});

const openMessage = () => {
  ElMessage({
    message: "Address copied!",
    type: "success",
  });
};

const clipboardData = navigator.clipboard;

const copyToClipboard = () => {
  clipboardData.writeText(props.address);
  openMessage();
};
</script>
<template>
  <figure @click="copyToClipboard">
    <vue-qrcode
      :value="props.moneroUri ?? props.address"
      :options="{
        width: 200,
        errorCorrectionLevel: 'Q',
      }"
    ></vue-qrcode>
    <img class="qrcode__image" src="/img/icons/android-chrome-512x512.png" alt="monero logo" />
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
  border-radius: 0.3rem;
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

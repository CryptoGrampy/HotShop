<script setup lang="ts">
import ReceiveComponent from "../components/ReceiveComponent.vue";
import { simplePayReady } from "../SimplePay";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponent class="header" />
  <el-row
    v-loading="!simplePayReady"
    justify="center"
    element-loading-text="Setting up HotShop..."
  >
    <el-col :span="24">
      <ReceiveComponent />
    </el-col>
  </el-row>
</template>

<style scoped>
.header {
  padding: 0px;
  margin-bottom: 10px;
}
</style>

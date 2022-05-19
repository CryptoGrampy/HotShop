<script setup lang="ts">
import Receive from '../components/Receive.vue';
import { simplePayReady } from '../SimplePay';
import Header from '../components/Header.vue';

</script>

<template>

  <Header class="header" />
  <el-row justify="center" v-loading="!simplePayReady" element-loading-text="Setting up HotShop...">
    <Receive />
  </el-row>
</template>

<style scoped>
html,
body {
  overflow: hidden;
  /* Hide scrollbars */
}

.main {
  min-height: 400px;
}

.header {
  padding: 0px;
  margin-bottom: 10px;
}
</style>
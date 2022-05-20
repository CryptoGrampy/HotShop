<script setup lang="ts">
import Receive from '../components/Receive.vue';
import { simplePayReady } from '../SimplePay';
import Header from '../components/Header.vue';

</script>

<template>

  <Header class="header" />
  <el-row justify="center" v-loading="!simplePayReady" element-loading-text="Setting up HotShop...">
    <el-col :span="24">
      <Receive />
    </el-col>
  </el-row>
</template>

<style scoped>
.header {
  padding: 0px;
  margin-bottom: 10px;
}
</style>
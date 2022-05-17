<script setup lang="ts">
import Receive from '../components/Receive.vue';
import { simplePayReady } from '../SimplePay';
import Header from '../components/Header.vue';

</script>

<template>

  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <div v-if="simplePayReady">
        <Receive />
      </div>
      <div v-if="!simplePayReady">Rolling up windows. Please wait... (may take a minute or so)</div>
    </el-main>
  </el-container>


</template>
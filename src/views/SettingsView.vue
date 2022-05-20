<script setup lang="ts">
import { simplePayReady } from '../SimplePay';
import Settings from '../components/Settings.vue';
import Header from '../components/Header.vue';

</script>

<template>
    <Header class="header" />
    <Settings />
</template>

<style scoped>
.header {
  padding: 0px;
}
</style>
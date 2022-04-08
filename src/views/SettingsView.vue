<script setup lang="ts">
import { simplePayReady } from '../SimplePay';
import Settings from '../components/Settings.vue';

</script>

<template>
    <h3>Hello, SettingsView</h3>
    <p v-if="simplePayReady">HotShop is Ready!</p>
    <Settings />
</template>

<style>

</style>
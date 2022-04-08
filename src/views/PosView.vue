<script setup lang="ts">
import { onBeforeMount } from 'vue'
import Settings from '../components/Settings.vue';
import { simplePay } from '../main';
import Receive from '../components/Receive.vue';
import { simplePayReady } from '../SimplePay';

</script>

<template>
    <h2>Hello, HotBox</h2>
    <div v-if="simplePayReady">
      <Receive />
    </div>

    <div v-if="!simplePayReady">Rolling up windows.  Please wait... (may take a minute or so)</div>
</template>

<style>
body {
    word-wrap: break-word;
}
</style>
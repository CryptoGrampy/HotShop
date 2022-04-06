<script setup lang="ts">
import { onBeforeMount } from 'vue'
import Settings from './components/Settings.vue';
import { simplePay } from './main';
import Receive from './components/Receive.vue';
import { simplePayReady } from './SimplePay';

onBeforeMount(async () => {
    await simplePay.updateConfig()
})

</script>

<template>
    <h2>Hello, HotBox</h2>
    <div v-if="simplePayReady">
      <Receive />
    </div>

    <div v-if="!simplePayReady">Rolling up windows.  Please wait... (may take a minute or so)</div>
    <Settings />
</template>

<style>
body {
    word-wrap: break-word;
}
</style>
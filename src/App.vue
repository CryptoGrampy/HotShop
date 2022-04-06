<script setup lang="ts">
import { onBeforeMount } from 'vue'
import Settings from './components/Settings.vue';
import { simplePay, simplePayInitialized } from './main';
import Receive from './components/Receive.vue';

onBeforeMount(async () => {
    simplePay.init().then(() => {
        simplePayInitialized.value = true
    })
})

</script>

<template>
    <h2>Hello, HotBox</h2>
    <div v-if="simplePayInitialized">
      <Receive />
    </div>

    <div v-if="!simplePayInitialized">Rolling up windows.  Please wait...</div>
    <Settings />
</template>

<style>
body {
    word-wrap: break-word;
}
</style>
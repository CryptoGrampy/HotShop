<script setup lang="ts">import { onBeforeMount } from 'vue';
import { simplePay } from './main';

onBeforeMount(async () => {
    await simplePay.updateConfig()
})
</script>

<template>
    <nav>
        <router-link to="/">Home</router-link>|
        <router-link to="/settings">Settings</router-link>|
    </nav>
    <router-view />
</template>

<style>

</style>
<script setup lang="ts">
import { useConfigStore } from './store/hot-shop-config';

const configStore = useConfigStore();
(async () => await configStore.init())()

/**
 * TODO: Think about best place to init simplepay
 * - set hashfragments to a store immediately,
 * - possibly do a check for valid config from store in router, if they don't exist, redirect user to settings/setup hotshop flow
 * - if hashfragments are set in userstore, run updateConfig() i.e. start up service and allow user to proceed to requested route
 * - potentially do this as a route guard with a simple boolean hasCredentials method in store
 */

</script>

<template>
    <nav>
        <router-link to="/">Home</router-link>|
        <router-link to="/settings">Settings</router-link>|
        <router-link to="/history">History</router-link>|
        <router-link to="/receive/0.0001">Quickpay</router-link>|
    </nav>
    <router-view />
</template>

<style>
input, button {
    border-radius: 0px !important;
}
</style>
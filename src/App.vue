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
    <el-row justify="center">
        <el-col :span="24">
            <router-view />
        </el-col>
    </el-row>
</template>

<style>
input,
button {
    border-radius: 0px !important;
}
</style>
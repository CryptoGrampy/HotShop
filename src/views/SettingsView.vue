<script setup lang="ts">
import { simplePayReady } from '../SimplePay';
import Settings from '../components/Settings.vue';
import Header from '../components/Header.vue';

</script>

<template>
    <el-container>
        <el-header>
            <Header />
        </el-header>
        <el-main>
            <Settings />
        </el-main>
    </el-container>


</template>

<style>
</style>
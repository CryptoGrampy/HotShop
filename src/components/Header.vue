<script setup lang="ts">
import { useConfigStore } from '../store/hot-shop-config';
import { storeToRefs } from 'pinia';

const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

</script>
<template>
    <h1>
        <img :src="user?.logoUrl"/>{{user?.shopName}}
    </h1>
</template>
<style>
img {
    max-height: 30px;

}
</style>

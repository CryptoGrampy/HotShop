<script setup lang="ts">
// TODO: Move to store
import { simplePayReady } from "../SimplePay";
</script>

<template>
  <span v-if="simplePayReady">🟢 Online</span>
  <span v-if="!simplePayReady">🔴 Offline</span>
</template>

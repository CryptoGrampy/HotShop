<script setup lang="ts">
import { useConfigStore } from "./store/hot-shop-config";
import StatusComponent from "./components/StatusComponent.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const configStore = useConfigStore();
const { kioskMode } = storeToRefs(configStore);

onMounted(async () => {
  await configStore.init();
});

/**
 * TODO: Think about best place to init simplepay
 * - set hashfragments to a store immediately,
 * - possibly do a check for valid config from store in router, if they don't exist, redirect user to settings/setup hotshop flow
 * - if hashfragments are set in userstore, run updateConfig() i.e. start up service and allow user to proceed to requested route
 * - potentially do this as a route guard with a simple boolean hasCredentials method in store
 */
</script>

<template>
  <el-row class="app-wrapper" justify="center">
    <el-col :xs="24" :sm="16" :md="14" :lg="12">
      <el-card :body-style="{ paddingTop: '0px' }">
        <router-view />
      </el-card>
    </el-col>
  </el-row>
  <el-row class="footer" justify="center" align="middle">
    <el-space :size="10" spacer="|">
      <StatusComponent />
      <a v-if="!kioskMode" href="https://github.com/CryptoGrampy/HotShop"
        >Powered by HotShop</a
      >
      <span v-if="kioskMode">Powered by HotShop</span>
      <router-link v-if="!kioskMode" :to="{ name: 'about' }">About</router-link>
    </el-space>
  </el-row>
  <el-row justify="center" class="warn">
    <span>This is <u>ALPHA</u> Software: expect and report bugs.</span>
  </el-row>
</template>

<style>
.app-wrapper {
  margin-bottom: 15px;
}

.warn {
  color: red;
  margin-top: 5px;
  font-size: 12px;
}

.footer {
  font-size: 12px;
}

html,
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

a,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}

.el-button {
  border-radius: 0px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
  font-weight: bold !important;
}
</style>

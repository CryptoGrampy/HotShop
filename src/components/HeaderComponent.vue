<script setup lang="ts">
import { useConfigStore } from "../store/hot-shop-config";
import { storeToRefs } from "pinia";
import { User } from "@element-plus/icons-vue";

const configStore = useConfigStore();
const { user } = storeToRefs(configStore);
</script>
<template>
  <el-row align="middle">
    <el-col :span="21">
      <router-link class="logo" :to="{ name: 'pos' }">
        <el-row align="middle">
          <img :src="user?.logoUrl" />
          <h1>
            {{ user?.shopName }}
          </h1>
        </el-row>
      </router-link>
    </el-col>
    <el-col :span="3">
      <el-row justify="end">
        <router-link :to="{ name: 'settings' }">
          <el-icon :size="30">
            <User />
          </el-icon>
        </router-link>&nbsp;
      </el-row>
    </el-col>
  </el-row>
</template>
<style scoped>
.timer {
  margin-right: 10px;
}

h1 {
  margin: unset;
  font-size: 20px;
  font-size:calc(100% + 1.3vw);
}

img {
  max-height: 40px;
  margin-right: 10px;
}
</style>

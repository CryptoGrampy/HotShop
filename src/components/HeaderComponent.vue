<script setup lang="ts">
import { useConfigStore } from "../store/hot-shop-config";
import { storeToRefs } from "pinia";
import { User, Monitor } from "@element-plus/icons-vue";

const configStore = useConfigStore();
const { user, kioskMode } = storeToRefs(configStore);

</script>
<template>
  <div class="header">
    <el-row align="middle">
      <el-col :span="21">
        <router-link class="logo" :to="{ name: 'pos' }">
          <el-row align="middle">
            <img :src="user?.logoUrl" />
            <h1 v-if="user?.displayShopName">
              {{ user?.shopName }}
            </h1>
          </el-row>
        </router-link>
      </el-col>
      <el-col :span="3">
        <el-row justify="end">
          <div v-if="kioskMode">
            <el-icon :size="30">
              <Monitor />
            </el-icon>
          </div>
          <div v-if="!kioskMode">
            <router-link :to="{ name: 'settings' }">
              <el-icon :size="30">
                <User />
              </el-icon>
            </router-link>&nbsp;
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>

</template>
<style scoped>
.header {
  padding: 0px;
  margin-top: 20px;
  margin-bottom: 30px;
}


.timer {
  margin-right: 10px;
}

h1 {
  margin: unset;
  font-size: 20px;
  font-size: calc(100% + 1.3vw);
}

img {
  max-height: 40px;
  margin-right: 10px;
}
</style>

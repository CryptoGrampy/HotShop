<script setup lang="ts">
import { useConfigStore } from '../store/hot-shop-config';
import { storeToRefs } from 'pinia';

import {
    User,
    Timer
} from '@element-plus/icons-vue'


const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

</script>
<template>
    <el-row class="row-bg" align="middle" justify="end">
        <el-col :span="17">
            <router-link class="logo" to="/">
                <el-row align="middle">
                    <img :src="user?.logoUrl" />
                    <h1>
                        {{ user?.shopName }}
                    </h1>

                </el-row>
            </router-link>
        </el-col>
        <el-col :span="7">
            <el-row justify="end">
                <!-- <router-link to="/history" class="timer">
                        <el-icon :size="30">
                            <Timer />
                        </el-icon>
                    </router-link>&nbsp -->
                <router-link to="/settings">
                    <el-icon :size="30">
                        <User />
                    </el-icon>
                </router-link>&nbsp

                <!-- <router-link to="/history">
                        <el-link>
                            History</el-link>
                    </router-link>&nbsp
                    <router-link to="/receive/0.0001">
                        <el-link>
                            Quickpay</el-link>
                    </router-link> -->
            </el-row>

        </el-col>
    </el-row>
</template>
<style scoped>
.timer {
    margin-right: 10px;
}

img {
    max-height: 40px;
    margin-right: 10px;
}


</style>

<script setup lang="ts">
import { useConfigStore } from '../store/hot-shop-config';
import { storeToRefs } from 'pinia';

const configStore = useConfigStore()
const { user } = storeToRefs(configStore)

</script>
<template>
    <nav>
        <el-row class="row-bg" align="middle" justify="end">
            <el-col :span="10">
                <router-link class="logo" to="/">
                    <el-row align="middle">
                        <img :src="user?.logoUrl" />
                        <h1>
                            {{ user?.shopName }}
                        </h1>

                    </el-row>
                </router-link>
            </el-col>
            <el-col :span="14">
                <el-row justify="end">
                    <router-link to="/settings">
                        <el-link>
                            Settings</el-link>
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


    </nav>
</template>
<style>
img {
    max-height: 30px;

}

a,
a:visited,
a:hover,
a:active {
    text-decoration: none;
    color: inherit;
}
</style>

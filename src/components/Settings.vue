<script setup lang="ts">import { reactive } from 'vue';
import { simplePay, simplePayInitialized } from '../main';
import { Network, SimplePayConfig, StagenetExplorers, MainnetExplorers } from '../SimplePay';

const { network, primaryAddress, secretViewKey, defaultConfirmations, blockExplorer } = simplePay.getConfig()

const settingsForm: SimplePayConfig = reactive({
    network,
    defaultConfirmations,
    primaryAddress,
    secretViewKey,
    blockExplorer
})

const updateSettings = () => {
    simplePayInitialized.value = false
    simplePay.updateConfig(settingsForm).then(() => {
        simplePayInitialized.value = true
    }).catch((err) => {
        console.log("Setting update error: ", err)
    })
}

</script>

<template>
    <h2>Settings</h2>

    <p>
        Network:
        <el-select v-model="settingsForm.network" placeholder="Select" size="large">
            <el-option v-for="item in Network" :key="item" :label="item" :value="item" />
        </el-select>
    </p>


    <p v-if="settingsForm.network === String(Network.stagenet)">
        Block Explorer:
        <el-select v-model="settingsForm.blockExplorer" placeholder="Select" size="large">
            <el-option v-for="item in StagenetExplorers" :key="item" :label="item" :value="item" />
        </el-select>
    </p>

    <p v-if="settingsForm.network === String(Network.mainnet)">
        Block Explorer:
        <el-select v-model="settingsForm.blockExplorer" placeholder="Select" size="large">
            <el-option v-for="item in MainnetExplorers" :key="item" :label="item" :value="item" />
        </el-select>
    </p>

    <p>
        Primary Address: 
         <el-input v-model="settingsForm.primaryAddress" placeholder="Please input your Primary Address" />
    </p>

    <p>
        View Key: 
         <el-input v-model="settingsForm.secretViewKey" placeholder="Please input your secret View Key" />
    </p>

    <p>
        Confirmations: 
         <el-input v-model="settingsForm.defaultConfirmations" placeholder="Please input your desired transaction confirmations (higher = slower confirmation)" />
    </p>

    <el-button @click="updateSettings" type="primary">Update Settings</el-button>
</template>
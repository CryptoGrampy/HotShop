<script setup lang="ts">import { reactive } from 'vue';
import { simplePay } from '../main';
import { Network, SimplePayConfig, simplePayReady } from '../SimplePay';

const { network, primaryAddress, secretViewKey, defaultConfirmations, monerodUri, monerodPassword, monerodUsername } = simplePay.getConfig()

const settingsForm: SimplePayConfig = reactive({
    network,
    defaultConfirmations,
    primaryAddress,
    secretViewKey,
    monerodPassword,
    monerodUsername,
    monerodUri
})

const updateSettings = async () => {
    simplePayReady.value = false
    await simplePay.updateConfig(settingsForm)
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

    <p>
        Monerod URI
        <el-input v-model="settingsForm.monerodUri" placeholder="Please input your Monerod address (note Mainnet/Stagenet)" />
    </p>

    <p>
        Monerod Username (Optional)
        <el-input v-model="settingsForm.monerodUsername" placeholder="Please input your Username" />
    </p>

    <p>
        Monerod Password (Optional)
         <el-input v-model="settingsForm.monerodPassword" placeholder="Please input your Password" />
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
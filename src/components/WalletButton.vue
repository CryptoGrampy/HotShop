<template>
    <el-button v-if="status.action == 'connecting'" type="primary" loading>Connecting</el-button>

    <el-button v-if="status.action == 'syncing'" type="warning" loading>Synchronizing {{ status.progress }}%</el-button>

    <el-button v-if="status.action == 'syncing' || status.action == 'ready'" @click="$emit('deposit-click')" type="primary">Deposit</el-button>

    <el-tooltip v-if="status.action == 'ready' && !status.empty" effect="dark" :disabled="status.unlocked" content="The balance hasn't been fully unlocked yet. This process is automatic, but may take up to 20 minutes." placement="top-start">
        <el-button :disabled="!status.unlocked" @click="$emit('redeem-click')" type="success">Redeem</el-button>
    </el-tooltip>
</template>

<script>
    export default {
        name: "WalletButton",

        emits: [
            "deposit-click",
            "redeem-click",
        ],

        props: {
            status: Object,
        },
    }
</script>
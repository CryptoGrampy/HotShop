<template>
    <el-button v-if="status.action == 'loading'" type="primary" loading>Loading</el-button>

    <el-button v-if="status.action == 'connecting'" type="primary" loading>Connecting</el-button>

    <el-button v-if="status.action == 'syncing'" type="warning" loading>Synchronizing <span v-if="status.progress > 0">&nbsp;{{ status.progress }}%</span></el-button>

    <el-button v-if="status.action != 'loading'" @click="$emit('depositClick')" type="primary">Deposit</el-button>

    <el-tooltip v-if="status.action == 'ready' && !status.empty" effect="dark" :disabled="status.unlocked" content="The balance hasn't been fully unlocked yet. This process is automatic, but may take up to 20 minutes." placement="top-start">
        <el-button :disabled="!status.unlocked" @click="$emit('redeemClick')" type="success">Redeem</el-button>
    </el-tooltip>
</template>

<script>
    export default {
        name: "WalletButton",

        emits: [
            "depositClick",
            "redeemClick",
        ],

        props: {
            status: Object,
        },
    }
</script>
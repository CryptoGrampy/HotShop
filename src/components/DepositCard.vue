<template>
    <el-card class="box-card">
        <template #header>
            <el-page-header content="Deposit funds to the wallet" @back="$emit('back')"></el-page-header>
        </template>

        <el-row>
            <el-col class="text-center">
                <h1>!!QR CODE!!</h1>
            </el-col>
        </el-row>

        <el-row>
            <el-col class="text-center">
                {{ address }}
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    export default {
        Name: "DepositCard",

        props: {
            address: String,
        },

        emits: [
            "back"
        ]
    }
</script>
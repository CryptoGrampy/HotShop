<script setup lang="ts">

const props = defineProps<{
    amount: string
    symbol: string
}>()

</script>

<template>
    <el-row justify="center" class="current-amount" align="middle">
        {{ props.symbol }} <span>{{ props.amount }}</span><span
            v-if="props.amount.charAt(props.amount.length - 1) === '.'" class="decimal-preview">0</span>
    </el-row>
</template>

<style scoped>
.current-amount {
    font-size: 50px;
    margin-bottom: 10px;
}

.decimal-preview {
    color: rgb(155, 152, 152);
}
</style>
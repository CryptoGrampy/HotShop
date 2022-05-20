<script setup lang="ts">
const props = defineProps<{
    success: boolean
    amount: number
}>()

</script>
<template>
    <el-result icon="success" title="Payment Successful" sub-title="Please follow the instructions"></el-result>    
</template>
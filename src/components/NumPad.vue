<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { ArrowLeftBold } from '@element-plus/icons-vue'

const currencies = [
    {
        value: 'XMR',
        label: 'XMR',
        symbol: 'ɱ'
    },
    {
        value: 'USD',
        label: 'USD',
        disabled: true,
        symbol: '$'
    },
]

const liveRate = ref(false)
const currency = ref('XMR')
const symbol = computed(() => {
    return currencies.find(val => val.value === currency.value)?.symbol
})

const currentAmount = ref('')


</script>
<template>
        {{currentAmount}}
    <div class="wrapper">
        <el-row justify="center">
            <p class="current-amount">
                {{ symbol }}0.00
            </p>
        </el-row>
        <div v-if="liveRate === true">
            <el-row justify="center">
                <p>
                    ~ 0.00 USD
                </p>
            </el-row>
            <el-row justify="center" class="">
                <el-select class="currency-select" style="border-radius: 20px;" v-model="currency" placeholder="Select"
                    size="small">
                    <el-option v-for="item in currencies" :key="item.value" :label="item.label" :value="item.value"
                        :disabled="item.disabled" />
                </el-select>
            </el-row>
        </div>
        <el-row justify="center">
            <el-col :span="24">
                <el-row justify="center">
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='1'" text class="numpad">1</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='2'" text class="numpad">2</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='3'" text class="numpad">3</el-button>
                    </el-col>
                </el-row>
                <el-row justify="center">
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='4'" text class="numpad">4</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='5'" text class="numpad">5</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='6'" text class="numpad">6</el-button>
                    </el-col>
                </el-row>
                <el-row justify="center">
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='7'" text class="numpad">7</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='8'" text class="numpad">8</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='9'" text class="numpad">9</el-button>
                    </el-col>
                </el-row>
                <el-row justify="center">
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount.indexOf('.') === -1 ? currentAmount+='.' : ''" text class="numpad">.</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount+='0'" text class="numpad">0</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="button" @touchend="currentAmount = currentAmount.slice(0, currentAmount.length - 1)" text class="numpad">
                            <el-icon :size="20">
                                <ArrowLeftBold />
                            </el-icon>
                        </el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
.wrapper {
    margin-bottom: 20px;
}

.numpad-wrapper {}

.current-amount {
    margin: 10px 0 20px;
    font-size: 50px;
}

.currency-select {
    width: 75px;
    /* TODO: add border radius here */
    border-radius: 20px;
}

button {
    /* TODO: size buttons/fonts with e+ breakpoints */
    border: 1px solid gray;
    min-width: 100px;
    padding: 30px 20px;
    font-size: 35px;
    touch-action: manipulation;
}
</style>
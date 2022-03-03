<template>
    <el-card class="box-card">
        <template #header>
            <el-page-header content="Deposit funds to the wallet" @back="$emit('back')"></el-page-header>
        </template>

        <el-row>
            <el-col class="text-center">
                <canvas ref="canvas" width="145" height="145" :title="address"></canvas>
            </el-col>
        </el-row>

        <br>

        <el-row>
            <el-col class="text-center break">
                {{ address }}
            </el-col>
        </el-row>
    </el-card>
</template>

<style scoped>
    .break {
        word-wrap: break-word;
    }

    .text-center {
        text-align:center;
    }
</style>

<script>
    import qrcode from "qrcode"

    export default {
        Name: "DepositCard",

        props: {
            address: String,
        },

        emits: [
            "back"
        ],

        async mounted() {
            const ctx = this.$refs.canvas.getContext("2d")

            let qrImage = new Image()
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 0, 0)
            }
            qrImage.src = await qrcode.toDataURL(this.address, {
                errorCorrectionLevel: 'L',
                width: 145,
                margin: 0,
            })
        }
    }
</script>
  <!-- <script setup lang="ts">
  import ReceiveComponent from "../components/ReceiveComponent.vue";
  import { simplePayReady } from "../SimplePay";
  import HeaderComponent from "../components/HeaderComponent.vue";
  import { defineProps } from "vue";

  const props = defineProps<{
    requestAmount: string;
  }>();
  </script>

  <template>
    <HeaderComponent />
    <el-row
      v-loading="!simplePayReady"
      justify="center"
      element-loading-text="Setting up HotShop..."
    >
    <el-col :span="24">
      <ReceiveComponent :quick-pay-amount="Number(props.requestAmount)" />
      </el-col>
    </el-row>
  </template> -->
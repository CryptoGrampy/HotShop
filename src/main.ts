import { createApp } from "vue"
import App from "./App.vue"
import { Network, SimplePay } from "./SimplePay";
import ElementPlus from "element-plus"
import router from './router'
import { get } from './urlparams'

const { simplePayConfig } = get()

// TODO: Move to a vue store
export const simplePay: SimplePay = new SimplePay({
    primaryAddress: simplePayConfig.primaryAddress,
    secretViewKey: simplePayConfig.secretViewKey,
    network: simplePayConfig.network,
    defaultConfirmations: simplePayConfig.defaultConfirmations,
    monerodUsername: simplePayConfig.monerodUsername,
    monerodPassword: simplePayConfig.monerodPassword,
    monerodUri: simplePayConfig.monerodUri   
})


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount("#app")

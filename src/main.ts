import { createApp } from "vue"
import App from "./App.vue"
import { Network, SimplePay } from "./SimplePay";
import ElementPlus from "element-plus"
import { createPinia } from "pinia";
import router from './router'

// TODO: optional config in simplepay constructor to get rid of these dummy vals
export const simplePay: SimplePay = new SimplePay({
    primaryAddress: '',
    secretViewKey: '',
    network: Network.mainnet,
    defaultConfirmations: 1,
    monerodUsername: '',
    monerodPassword: '',
    monerodUri: ''   
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount("#app")

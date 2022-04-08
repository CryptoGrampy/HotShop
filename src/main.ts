import { createApp } from "vue"
import App from "./App.vue"
import { Network, SimplePay } from "./SimplePay";
import ElementPlus from "element-plus"
import router from './router'

// TODO: Move to a vue store
export const simplePay: SimplePay = new SimplePay({
    primaryAddress: '5BQ3XRcPdRyMGjZ4MdBvFxiqtkixYwsaz3tNM29VDeihEozHnTbA53bSHF9EZzbkymLnaaZh3K4AaGHHEfQ8WP2PEoG29jT',
    secretViewKey: '40863a5156686b27dca46a843cbbe2c55c2a4fd60e52a9e4322ffa9cfe8b6b01',
    network: Network.stagenet,
    defaultConfirmations: 1,
    monerodUsername: '',
    monerodPassword: '',
    monerodUri: 'https://node.xmr.gift:443'
})


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount("#app")

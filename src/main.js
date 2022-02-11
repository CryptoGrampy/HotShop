import { createApp } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"

import Wallet from "./components/Wallet.vue"

const app = createApp(App)
app.use(ElementPlus)
app.component("wallet", Wallet)
app.mount("#app")
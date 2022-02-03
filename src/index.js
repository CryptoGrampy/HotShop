import { createApp } from "vue"
import App from "./App.vue"
import NewTransactionComponent from "./components/NewTransaction.vue"

const app = createApp(App)
app.component("new-transaction", NewTransactionComponent)
app.mount("#app")

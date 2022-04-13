import { createApp } from "vue"
import App from "./App.vue"
import { SimplePay } from "./SimplePay";
import ElementPlus from "element-plus"
import { createPinia } from "pinia";
import router from './router'
import { get } from './urlparams'

const { simplePayConfig } = get()

export const simplePay: SimplePay = new SimplePay({
    primaryAddress: simplePayConfig.primaryAddress,
    secretViewKey: simplePayConfig.secretViewKey,
    network: simplePayConfig.network,
    defaultConfirmations: simplePayConfig.defaultConfirmations,
    monerodUsername: simplePayConfig.monerodUsername,
    monerodPassword: simplePayConfig.monerodPassword,
    monerodUri: simplePayConfig.monerodUri   
})

/**
 * TODO: Think about best place to init
 * - set hashfragments to a store immediately,
 * - possibly do a check for valid config from store in router, if they don't exist, redirect user to settings/setup flow
 * - if hashfragments are set in userstore, run updateConfig() i.e. start up service and allow user to proceed to requested route
 * - potentially do this as a route guard with a simple boolean hasCredentials method in store
 */
if (simplePayConfig.monerodUri) {
    (async () => await simplePay.updateConfig())()
}

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount("#app")

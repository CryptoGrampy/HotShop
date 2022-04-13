import { defineStore, storeToRefs } from "pinia";

/**
 * - store hashfragments here
 * - store simplepay config
 * - custom user config- brand name, logo, showTipButton, Tip amount, displayUSD, preferUSDPrice
 * - current url (constructed url with hash fragments for bookmarking)
 */

export const useConfig = defineStore('config', {
    state: () => {
        return {
            moneroUri: '',
            companyName: 'GrampyShop'
        }
    }
})
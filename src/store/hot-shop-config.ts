import { Network, SimplePayConfig } from "../SimplePay";
import { defineStore } from "pinia";
import {
  getConfigFromHash,
  getHashFromConfig,
  getUrlOrigin,
} from "../urlparams";
import { simplePay } from "../main";
import { CurrencyOption, ExchangeCurrencyOptions } from "./currency";

/**
 * - store hashfragments here
 * - store simplepay config
 * - custom user config- brand name, logo, showTipButton, Tip amount, displayUSD, preferUSDPrice
 * - shop url (constructed url with hash fragments for bookmarking)
 * - settings url - a bookmarkable url for users to access their settings
 */

export interface UserConfig {
  logoUrl?: string;
  shopName?: string;
  uniqueShopUrl?: string;
  exchangeCurrency?: ExchangeCurrencyOptions;
  useExchangeAsPrimary?: boolean;
  displayShopName?: boolean;
}

// Things not used or saved across sessions
export interface SessionConfig {
  requestAmount: number;
}

export interface HotShopConfig {
  payment: SimplePayConfig;
  user?: UserConfig;
  // session: SessionConfig
}

export const useConfigStore = defineStore("hot-shop-config", {
  state: (): HotShopConfig => ({
    payment: {
      primaryAddress: "",
      secretViewKey: "",
      network: Network.mainnet,
      monerodUri: "",
      defaultConfirmations: 0,
      monerodUsername: "",
      monerodPassword: "",
    },
    user: {
      logoUrl:
        "https://www.getmonero.org/press-kit/symbols/monero-symbol-480.png",
      shopName: "Grampy Shop",
      exchangeCurrency: CurrencyOption.USD,
      useExchangeAsPrimary: true,
      displayShopName: true
    },
  }),
  getters: {
    myHotShopUrl(state): string {
      return `${getUrlOrigin()}/#/#${getHashFromConfig({
        payment: state.payment,
        user: state.user,
      })}`;
    },
    currentConfig(): HotShopConfig {
      return { payment: this.payment, user: this.user };
    },
  },
  actions: {
    async init() {
      const hashConfig = getConfigFromHash();
      this.$state = { ...this.$state, ...hashConfig };
      await simplePay.updateConfig(this.payment);
    },
    increment(): void {
      this.payment.defaultConfirmations++;
    },
    updateUserConfig(updatedConfig: UserConfig) {
      this.user = { ...this.user, ...updatedConfig };
    },
    getStaticConfig(): HotShopConfig {
      const config = this.$state;
      return config;
    },
  },
});

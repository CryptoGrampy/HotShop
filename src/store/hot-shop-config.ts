import { SimplePayConfig } from "../SimplePay";
import { defineStore } from "pinia";
import {
  getConfigFromHash,
  getHashFromConfig,
  getUrlOrigin,
} from "../urlparams";
import { simplePay } from "../main";
import { ExchangeCurrencyOptions } from "./currency";
import { get, update } from "idb-keyval";

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
  kiosk?: boolean;
}

export const defaultEmptyHotShopConfig: HotShopConfig = {
  payment: {
    primaryAddress: null,
    secretViewKey: null,
    network: null,
    monerodUri: null,
    defaultConfirmations: null,
    monerodUsername: null,
    monerodPassword: null,
  },
  user: {
    logoUrl: null,
    shopName: null,
    uniqueShopUrl: null,
    exchangeCurrency: null,
    useExchangeAsPrimary: null,
    displayShopName: null,
    kiosk: null,
  },
} as unknown as HotShopConfig;

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
    ...defaultEmptyHotShopConfig,
  }),
  getters: {
    myHotShopUrl(state): string {
      return `${getUrlOrigin()}/#/#${encodeURIComponent(
        getHashFromConfig({
          payment: state.payment,
          user: state.user,
        })
      )}`;
    },
    myKioskUrl(state): string {
      return `${getUrlOrigin()}/#/#${encodeURIComponent(
        getHashFromConfig({
          payment: state.payment,
          user: { ...state.user, kiosk: true },
        })
      )}`;
    },
    kioskMode(state): boolean {
      return Boolean(state.user?.kiosk);
    },
    currentConfig(): HotShopConfig {
      return { payment: this.payment, user: this.user };
    },
  },
  actions: {
    async init() {
      const hashConfig = getConfigFromHash();
      const cachedConfig = await get("config").catch((err) =>
        console.log("error retrieving cachedConfig", err)
      );

      // TODO: Replace primary address with isCustomHotshop method

      if (
        hashConfig.payment.primaryAddress !==
        "49ouNFXbQxj72FYjEgRjVTa35dHVrSL118vNFhxDvQWHJYpZp523EckbrqiSjM6Vb1H6Ap43qYpNRHBaVS9oBFtZUeTaH88"
      ) {
        this.$state = { ...this.$state, ...hashConfig };
        update("config", () => JSON.stringify(hashConfig)).catch((err) => {
          console.log("error updating config");
        });
      } else if (cachedConfig) {
        this.$state = { ...this.$state, ...JSON.parse(cachedConfig) };
      } else {
        this.$state = { ...this.$state, ...hashConfig };
      }

      await simplePay.updateConfig(this.payment);
    },
    increment(): void {
      this.payment.defaultConfirmations++;
    },
    updateConfig(updatedConfig: UserConfig) {
      this.user = { ...this.user, ...updatedConfig };
    },
    getStaticConfig(): HotShopConfig {
      const config = this.$state;
      return config;
    },
  },
});

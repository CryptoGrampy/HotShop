import { Ref, ref } from "vue";
import { Dict } from "../util";

export interface Currency {
  displayName: string;
  ticker: string;
  symbol: string;
  exchangeRate: number;
}

export enum CurrencyOption {
  XMR = "XMR",
  USD = "USD",
  EUR = "EUR",
  BRL = "BRL",
  NONE = "NONE",
}

export type ExchangeCurrencyOptions = Exclude<
  CurrencyOption,
  CurrencyOption.XMR
>;

export const currencies: Dict<Currency> = {
  [CurrencyOption.XMR]: {
    displayName: "XMR",
    ticker: CurrencyOption.XMR,
    symbol: "ɱ",
    exchangeRate: 1,
  },
  [CurrencyOption.USD]: {
    displayName: "USD",
    ticker: CurrencyOption.USD,
    exchangeRate: 0,
    symbol: "$",
  },
  [CurrencyOption.EUR]: {
    displayName: "EUR",
    ticker: CurrencyOption.EUR,
    exchangeRate: 0,
    symbol: "€",
  },
  [CurrencyOption.BRL]: {
    displayName: "BRL",
    ticker: CurrencyOption.BRL,
    exchangeRate: 0,
    symbol: "R$",
  },
  [CurrencyOption.NONE]: {
    displayName: "None",
    ticker: CurrencyOption.NONE,
    symbol: "",
    exchangeRate: 0,
  },
};

/**
 * - exchangeCurrency gets updated when settings initializes and when settings are updated
 * - if exchangeCurrency is not '', begin tracking exchange rate - components shouldn't need to deal with this and should happen automatically
 * - if exchangeCurrency updates to '', stop tracking exchange rate
 * - if exchangeCurrency updates to NOT '', begin tracking rate again
 */

let intervalRef: NodeJS.Timer;
export const exchangeCurrency: Ref<Currency> = ref(
  currencies[CurrencyOption.NONE]
);
export const exchangeCurrencyStatus: Ref<boolean> = ref(false);

const getRate = async (currency: ExchangeCurrencyOptions) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=${currencies[currency].displayName}`
  );
  const json = await response.json();

  exchangeCurrency.value = currencies[currency];
  const currentExchangeRate =
    json['monero'][currencies[currency].displayName.toLowerCase()];

  if (currentExchangeRate && currentExchangeRate > 0) {
    exchangeCurrencyStatus.value = true;
    exchangeCurrency.value.exchangeRate =
      currentExchangeRate;
  } else {
    exchangeCurrency.value = currencies[CurrencyOption.NONE];
    exchangeCurrencyStatus.value = false;
  }
};

export const trackExchangeRate = async (currency: ExchangeCurrencyOptions) => {
  if (currency !== CurrencyOption.NONE) {
    await getRate(CurrencyOption[String(currency)]);
    intervalRef = setInterval(async () => {
      await getRate(CurrencyOption[String(currency)]);
    }, 60000);
  } else {
    stopTrackingRate();
  }
};

export const stopTrackingRate = () => {
  exchangeCurrencyStatus.value = false;
  exchangeCurrency.value = currencies[CurrencyOption.NONE];
  clearInterval(intervalRef);
};

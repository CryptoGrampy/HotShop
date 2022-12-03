import { Ref, ref } from "vue";
import { currencies, Currency, CurrencyOption, ExchangeCurrencyOptions } from "./currencies";


/**
 * - exchangeCurrency gets updated when settings initializes and when settings are updated
 * - if exchangeCurrency is not '', begin tracking exchange rate - components shouldn't need to deal with this and should happen automatically
 * - if exchangeCurrency updates to '', stop tracking exchange rate
 * - if exchangeCurrency updates to NOT '', begin tracking rate again
 */

let intervalRef;

export const exchangeCurrency: Ref<Currency> = ref(
  currencies[CurrencyOption.NONE]
);
export const exchangeCurrencyStatus: Ref<boolean> = ref(false);

const getRate = async (currency: ExchangeCurrencyOptions) => {
  if (currency) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=${currencies[currency].displayName}`
    );
    const json = await response.json();

    exchangeCurrency.value = currencies[currency];
    const currentExchangeRate =
      json["monero"][currencies[currency].displayName.toLowerCase()];

    if (currentExchangeRate && currentExchangeRate > 0) {
      exchangeCurrencyStatus.value = true;
      exchangeCurrency.value.exchangeRate = currentExchangeRate;
    } else {
      exchangeCurrency.value = currencies[CurrencyOption.NONE];
      exchangeCurrencyStatus.value = false;
    }
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

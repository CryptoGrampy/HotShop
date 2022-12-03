import { Dict } from "../util";

export interface Currency {
  displayName: string;
  ticker: string;
  symbol: string;
  exchangeRate: number;
}

export enum CurrencyOption {
  AED = "AED",
  ARS = "ARS",
  AUD = "AUD",
  BDT = "BDT",
  BHD = "BHD",
  BITS = "BITS",
  BMD = "BMD",
  BRL = "BRL",
  BTC = "BTC",
  CAD = "CAD",
  CHF = "CHF",
  CLP = "CLP",
  CNY = "CNY",
  CZK = "CZK",
  DKK = "DKK",
  EUR = "EUR",
  GBP = "GBP",
  HKD = "HKD",
  HUF = "HUF",
  IDR = "IDR",
  ILS = "ILS",
  INR = "INR",
  JPY = "JPY",
  KRW = "KRW",
  KWD = "KWD",
  LKR = "LKR",
  MMK = "MMK",
  MXN = "MXN",
  MYR = "MYR",
  NGN = "NGN",
  NOK = "NOK",
  NONE = "NONE",
  NZD = "NZD",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  RUB = "RUB",
  SAR = "SAR",
  SATS = "SATS",
  SEK = "SEK",
  SGD = "SGD",
  THB = "THB",
  TRY = "TRY",
  TWD = "TWD",
  UAH = "UAH",
  USD = "USD",
  VEF = "VEF",
  VND = "VND",
  XAG = "XAG",
  XAU = "XAU",
  XDR = "XDR",
  XMR = "XMR",
  ZAR = "ZAR",
}

export type ExchangeCurrencyOptions = Exclude<
  CurrencyOption,
  CurrencyOption.XMR
>;

export const currencies: Dict<Currency> = {
  [CurrencyOption.NONE]: {
    displayName: "None",
    ticker: CurrencyOption.NONE,
    symbol: "",
    exchangeRate: 0,
  },
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
  [CurrencyOption.ARS]: {
    displayName: "ARS",
    ticker: CurrencyOption.ARS,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.AUD]: {
    displayName: "AUD",
    ticker: CurrencyOption.AUD,
    symbol: "$",
    exchangeRate: 0,
  },

  [CurrencyOption.BMD]: {
    displayName: "BMD",
    ticker: CurrencyOption.BMD,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.BTC]: {
    displayName: "BTC",
    ticker: CurrencyOption.BTC,
    symbol: "₿",
    exchangeRate: 0,
  },
  [CurrencyOption.CAD]: {
    displayName: "CAD",
    ticker: CurrencyOption.CAD,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.CHF]: {
    displayName: "CHF",
    ticker: CurrencyOption.CHF,
    symbol: "CHF",
    exchangeRate: 0,
  },
  [CurrencyOption.CLP]: {
    displayName: "CLP",
    ticker: CurrencyOption.CLP,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.CNY]: {
    displayName: "CNY",
    ticker: CurrencyOption.CNY,
    symbol: "¥",
    exchangeRate: 0,
  },
  [CurrencyOption.CZK]: {
    displayName: "CZK",
    ticker: CurrencyOption.CZK,
    symbol: "Kč",
    exchangeRate: 0,
  },
  [CurrencyOption.DKK]: {
    displayName: "DKK",
    ticker: CurrencyOption.DKK,
    symbol: "kr",
    exchangeRate: 0,
  },
 
  [CurrencyOption.GBP]: {
    displayName: "GBP",
    ticker: CurrencyOption.GBP,
    symbol: "£",
    exchangeRate: 0,
  },
  [CurrencyOption.HKD]: {
    displayName: "HKD",
    ticker: CurrencyOption.HKD,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.HUF]: {
    displayName: "HUF",
    ticker: CurrencyOption.HUF,
    symbol: "Ft",
    exchangeRate: 0,
  },
  [CurrencyOption.IDR]: {
    displayName: "IDR",
    ticker: CurrencyOption.IDR,
    symbol: "Rp",
    exchangeRate: 0,
  },
  [CurrencyOption.ILS]: {
    displayName: "ILS",
    ticker: CurrencyOption.ILS,
    symbol: "₪",
    exchangeRate: 0,
  },
  
  [CurrencyOption.JPY]: {
    displayName: "JPY",
    ticker: CurrencyOption.JPY,
    symbol: "¥",
    exchangeRate: 0,
  },
  [CurrencyOption.KRW]: {
    displayName: "KRW",
    ticker: CurrencyOption.KRW,
    symbol: "₩",
    exchangeRate: 0,
  },
  
  [CurrencyOption.LKR]: {
    displayName: "LKR",
    ticker: CurrencyOption.LKR,
    symbol: "₨",
    exchangeRate: 0,
  },
  
  [CurrencyOption.MXN]: {
    displayName: "MXN",
    ticker: CurrencyOption.MXN,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.MYR]: {
    displayName: "MYR",
    ticker: CurrencyOption.MYR,
    symbol: "RM",
    exchangeRate: 0,
  },
  [CurrencyOption.NGN]: {
    displayName: "NGN",
    ticker: CurrencyOption.NGN,
    symbol: "₦",
    exchangeRate: 0,
  },
  [CurrencyOption.NOK]: {
    displayName: "NOK",
    ticker: CurrencyOption.NOK,
    symbol: "kr",
    exchangeRate: 0,
  },
  [CurrencyOption.NZD]: {
    displayName: "NZD",
    ticker: CurrencyOption.NZD,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.PHP]: {
    displayName: "PHP",
    ticker: CurrencyOption.PHP,
    symbol: "₱",
    exchangeRate: 0,
  },
  [CurrencyOption.PKR]: {
    displayName: "PKR",
    ticker: CurrencyOption.PKR,
    symbol: "₨",
    exchangeRate: 0,
  },
  [CurrencyOption.PLN]: {
    displayName: "PLN",
    ticker: CurrencyOption.PLN,
    symbol: "zł",
    exchangeRate: 0,
  },
  [CurrencyOption.RUB]: {
    displayName: "RUB",
    ticker: CurrencyOption.RUB,
    symbol: "₽",
    exchangeRate: 0,
  },
  [CurrencyOption.SAR]: {
    displayName: "SAR",
    ticker: CurrencyOption.SAR,
    symbol: "﷼",
    exchangeRate: 0,
  },
  [CurrencyOption.SATS]: {
    displayName: "SATS",
    ticker: CurrencyOption.SATS,
    symbol: "丰",
    exchangeRate: 0,
  },
  [CurrencyOption.SEK]: {
    displayName: "SEK",
    ticker: CurrencyOption.SEK,
    symbol: "kr",
    exchangeRate: 0,
  },
  [CurrencyOption.SGD]: {
    displayName: "SGD",
    ticker: CurrencyOption.SGD,
    symbol: "$",
    exchangeRate: 0,
  },
  [CurrencyOption.THB]: {
    displayName: "THB",
    ticker: CurrencyOption.THB,
    symbol: "฿",
    exchangeRate: 0,
  },
  [CurrencyOption.TRY]: {
    displayName: "TRY",
    ticker: CurrencyOption.TRY,
    symbol: "₺",
    exchangeRate: 0,
  },
  [CurrencyOption.TWD]: {
    displayName: "TWD",
    ticker: CurrencyOption.TWD,
    symbol: "NT$",
    exchangeRate: 0,
  },
  [CurrencyOption.UAH]: {
    displayName: "UAH",
    ticker: CurrencyOption.UAH,
    symbol: "₴",
    exchangeRate: 0,
  },

  [CurrencyOption.VEF]: {
    displayName: "VEF",
    ticker: CurrencyOption.VEF,
    symbol: "Bs",
    exchangeRate: 0,
  },
  [CurrencyOption.VND]: {
    displayName: "VND",
    ticker: CurrencyOption.VND,
    symbol: "₫",
    exchangeRate: 0,
  },
  [CurrencyOption.ZAR]: {
    displayName: "ZAR",
    ticker: CurrencyOption.ZAR,
    symbol: "R",
    exchangeRate: 0,
  },
};

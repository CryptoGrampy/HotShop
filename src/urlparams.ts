import { Network, SimplePayConfig } from "./SimplePay";
import { CurrencyOption } from "./store/currencies";
import { defaultEmptyHotShopConfig, HotShopConfig, UserConfig } from "./store/hot-shop-config";

interface HashParamConfig extends SimplePayConfig, UserConfig { }

export const getConfigFromHash = (): HotShopConfig => {
  // get all hashes (could be more than 1)
  const hashFragments = window.location.hash.split("#");
  // get last hash - this is where the custom config lives, and decode
  const hash = decodeURIComponent(hashFragments[hashFragments.length - 1]);

  // if user has provided config
  if (hash.includes('primaryAddress')) {

    const hashConfig: HashParamConfig = { ...defaultEmptyHotShopConfig.payment, ...defaultEmptyHotShopConfig.user }

    hash.split("&").map((keyvalue) => {
      const temp = keyvalue.split("=");
      hashConfig[temp[0]] = temp[1];
    });

    const config: HotShopConfig = {
      payment: {
        primaryAddress: hashConfig.primaryAddress,
        secretViewKey: hashConfig.secretViewKey,
        network: hashConfig.network,
        monerodUri: hashConfig.monerodUri,
        monerodUsername: hashConfig.monerodUsername,
        monerodPassword: hashConfig.monerodPassword,
        defaultConfirmations: hashConfig.defaultConfirmations,
      },
      user: {
        shopName: hashConfig.shopName,
        logoUrl: hashConfig.logoUrl,
        exchangeCurrency: CurrencyOption[String(hashConfig.exchangeCurrency)],
        useExchangeAsPrimary: (hashConfig.useExchangeAsPrimary === true || (hashConfig.useExchangeAsPrimary as unknown as string) === 'true'),
        displayShopName: (hashConfig.displayShopName === true || (hashConfig.displayShopName as unknown as string) === 'true'),
        kiosk: (hashConfig.kiosk === true || (hashConfig.kiosk as unknown as string) === 'true')
      },
    };

    return config
  } else {
    // default to testing hotshop config
    const hotShopTestConfig: HotShopConfig = {
      payment: {
        primaryAddress:
          "49ouNFXbQxj72FYjEgRjVTa35dHVrSL118vNFhxDvQWHJYpZp523EckbrqiSjM6Vb1H6Ap43qYpNRHBaVS9oBFtZUeTaH88",
        secretViewKey:
          "9fb781ad709a41bd651f92c2e380813b9ca8abfb7e733105202e1d9f12799c03",
        network: Network.mainnet,
        monerodUri: "https://community.organic-meatballs.duckdns.org:443",
        defaultConfirmations: 0,
        monerodUsername: "",
        monerodPassword: "",
      },
      user: {
        exchangeCurrency: CurrencyOption.USD,
        useExchangeAsPrimary: true,
        shopName: 'HotShop',
        displayShopName: false,
        kiosk: false,
        logoUrl: "/img/hotshop-logo2.png",
      }
    }

    return hotShopTestConfig
  }  
};

// Generates hash fragment portion of bookmarkable HotShop URL 
export const getHashFromConfig = (config: HotShopConfig): string => {
  const fullConfig = { ...config.payment, ...config.user };

  let hashFragment = "";

  Object.keys(fullConfig).map((key, index, array) => {
    hashFragment += `${key}=${fullConfig[key]}${index !== array.length - 1 ? "&" : ""
      }`;
  });

  return hashFragment;
};

export const getUrlOrigin = (): string => {
  return window.location.origin;
};

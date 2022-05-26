import { Network } from "./SimplePay";
import { CurrencyOption } from "./store/currency";
import { HotShopConfig } from "./store/hot-shop-config";

export const getConfigFromHash = (): HotShopConfig => {
    // get all hashes (could be more than 1)
    const hashFragments = window.location.hash.split('#')
    // get last hash - this is where the custom config lives, and decode
    const hash = decodeURIComponent(hashFragments[hashFragments.length - 1])

    // Set default app params - might change this in the future
    const params = {
        primaryAddress: '49ouNFXbQxj72FYjEgRjVTa35dHVrSL118vNFhxDvQWHJYpZp523EckbrqiSjM6Vb1H6Ap43qYpNRHBaVS9oBFtZUeTaH88',
        secretViewKey: '9fb781ad709a41bd651f92c2e380813b9ca8abfb7e733105202e1d9f12799c03',
        network: Network.mainnet,
        monerodUri: 'https://community.organic-meatballs.duckdns.org:443',
        defaultConfirmations: 0,
        monerodUsername: '',
        monerodPassword: '',
        exchangeCurrency: 'USD',
        useAsPrimary: true,
        shopName: 'HotShop',
        logoUrl: 'https://www.getmonero.org/press-kit/symbols/monero-symbol-480.png'
    }

    hash.split('&').map(keyvalue => {
        let temp = keyvalue.split('=');
        params[temp[0]] = temp[1]
    });

    const config: HotShopConfig = {
        payment: {
            primaryAddress: params.primaryAddress,
            secretViewKey: params.secretViewKey,
            network: params.network,
            monerodUri: params.monerodUri,
            monerodUsername: params.monerodUsername,
            monerodPassword: params.monerodPassword,
            defaultConfirmations: params.defaultConfirmations,
        },
        user: {
            shopName: params.shopName,
            logoUrl: params.logoUrl,
            exchangeCurrency: CurrencyOption[String(params.exchangeCurrency)],
            useExchangeAsPrimary: params.useAsPrimary
        },
    }

    // TODO: clear fragments from url window.location.hash = ''
    return config
}


// Generates hash fragment portion of bookmarkable HotShop URL
export const getHashFromConfig = (config: HotShopConfig): string => {
    const fullConfig = {...config.payment, ...config.user}

    let hashFragment = ''

    Object.keys(fullConfig).map((key, index, array) => {
        if (fullConfig[key] !== undefined && String(fullConfig[key]).length > 0) {
            hashFragment += `${key}=${fullConfig[key]}${index !== array.length - 1 ? '&' : ''}`
        }
    })
    
    return encodeURIComponent(hashFragment)
}

export const getUrlOrigin = (): string => {
    return window.location.origin
}
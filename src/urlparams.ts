import { Network, SimplePayConfig } from "./SimplePay";

export interface UriValues {
    simplePayConfig: SimplePayConfig
    requestAmount?: number
}

export const get = (): UriValues => {
    console.log(window.location.hash)

    console.log(window.location.hash.split('#'))
    // get all hashes (could be more than 1)
    const hashFragments = window.location.hash.split('#')
    // get last
    const hash = hashFragments[hashFragments.length-1]

    // Set default app params
    const params = {
        p: '49ouNFXbQxj72FYjEgRjVTa35dHVrSL118vNFhxDvQWHJYpZp523EckbrqiSjM6Vb1H6Ap43qYpNRHBaVS9oBFtZUeTaH88',
        v: '9fb781ad709a41bd651f92c2e380813b9ca8abfb7e733105202e1d9f12799c03',
        n: Network.mainnet,
        m: 'https://community.organic-meatballs.duckdns.org:443',
        c: 0,
        u: '',
        w: '',
        a: 0
    }

    hash.split('&').map(keyvalue => {
        let temp = keyvalue.split('=');
        params[temp[0]] = temp[1]
    });

    const config: UriValues = {
    simplePayConfig: {
        primaryAddress: params.p,
        secretViewKey: params.v,
        network: params.n,
        monerodUri: params.m,
        monerodUsername: params.u,
        monerodPassword: params.w,
        defaultConfirmations: params.c,
    },
    requestAmount: params.a
    }

    console.log('Config', config)

    // window.location.hash = ''
    return config
}

// set(param, value) {
//     const urlParams = new URLSearchParams(window.location.search)
//     urlParams.set(param, value)
//     history.replaceState(null, "", "?"+urlParams.toString()+window.location.hash)
// },

export const getRestoreHeight = (defaultValue?: string) => {
    const restoreHeight = get()
    if (restoreHeight == null) {
        return (defaultValue !== undefined) ? defaultValue : null
    }
}

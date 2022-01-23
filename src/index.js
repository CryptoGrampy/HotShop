'use strict';

const monerojs = require('monero-javascript')
const moneroutils = require('./moneroutils')

const serverUri = 'monero-stagenet.exan.tech:38081'
const networkType = monerojs.MoneroNetworkType.STAGENET
const defaultWalletConfig = {
    language: 'English',
    // Password cannot be empty a dummy password will do.
    password: 'walletPassword',
    networkType: networkType,
    proxyToWorker: true,
}

async function generateWallet() {
    return monerojs.createWalletFull(defaultWalletConfig)
}

async function recoverWallet(primaryAddress, privateViewKey, privateSpendKey) {
    return monerojs.createWalletFull({
        ...defaultWalletConfig,
        ...{
            primaryAddress: primaryAddress,
            privateViewKey: privateViewKey,
            privateSpendKey: privateSpendKey,
        },
    })
}

async function main() {
    const seed = window.location.hash.substr(1)
    let wallet = {}
    if (seed !== '') {
        console.log('recovering wallet')
        const privateSpendKey = seed
        const privateViewKey = moneroutils.derivePrivateViewKey(privateSpendKey)
        const publicSpendKey = moneroutils.derivePublicKey(privateSpendKey)
        const publicViewKey = moneroutils.derivePublicKey(privateViewKey)
        const primaryAddress = moneroutils.derivePrimaryAddress(networkType, publicSpendKey, publicViewKey)
        wallet = await recoverWallet(primaryAddress, privateViewKey, privateSpendKey)
    } else {
        console.log('generating wallet')
        wallet = await generateWallet()
    }

    const mnemonic = await wallet.getMnemonic()
    const privateSpendKey = await wallet.getPrivateSpendKey()
    const privateViewKey = await wallet.getPrivateViewKey()
    const publicSpendKey = await wallet.getPublicSpendKey()
    const publicViewKey = await wallet.getPublicViewKey()
    const primaryAddress = await wallet.getPrimaryAddress()

    window.location.hash = privateSpendKey

    console.log(mnemonic)
    console.log('private spend key:', privateSpendKey)
    console.log('private view key:', privateViewKey)
    console.log('public spend key:', publicSpendKey)
    console.log('public view key:', publicViewKey)
    console.log('primary address:', primaryAddress)

    wallet.setDaemonConnection(serverUri)
    wallet.startSyncing()
}

main()

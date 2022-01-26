import crypto from "./crypto"
import base58 from "base58-monero"
import monerojs from "monero-javascript"

function derivePrivateViewKey(privateSpendKey) {
    return crypto.reduceScalar32(crypto.fastHash(privateSpendKey)).toString('hex')
}

function derivePublicKey(privateKey) {
    return crypto.secretKeyToPublicKey(privateKey).toString('hex')
}

function derivePrimaryAddress(network, publicSpendKey, publicViewKey) {
    function networkTypeToByte(network) {
        switch (network) {
            case monerojs.MoneroNetworkType.MAINNET:
                return Buffer.from([18])
            case monerojs.MoneroNetworkType.STAGENET:
                return Buffer.from([24])
            case monerojs.MoneroNetworkType.TESTNET:
                return Buffer.from([53])
            default:
                throw new Error('unknown network type')
        }
    }

    let data = Buffer.concat([
        networkTypeToByte(network),
        Buffer.from(publicSpendKey, 'hex'),
        Buffer.from(publicViewKey, 'hex'),
    ])
    const chsum = crypto.fastHash(data).slice(0, 4)
    return base58.encode(Buffer.concat([data, chsum]))
}

export default { derivePrivateViewKey, derivePublicKey, derivePrimaryAddress }
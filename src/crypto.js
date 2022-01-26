'use strict';

const keccak256 = require('keccak256')
const BN = require('bn.js')
const elliptic = require('elliptic')
const ec = new elliptic.eddsa('ed25519')

function fastHash(data) {
    if (typeof data === 'string') data = Buffer.from(data, 'hex');
    return keccak256(data)
}

function reduceScalar32(scalar) {
    const num = decodeInt(scalar);
    return encodeInt(num.umod(ec.curve.n));
}

function decodeInt(buf) {
    if (typeof buf === 'string') buf = Buffer.from(buf, 'hex');
    return new BN(buf, 'hex', 'le');
}

function encodeInt(num) {
    // bn.js toBuffer can not find Buffer in webpack v5
    return num.toArrayLike(Buffer, 'le', 32);
}

function secretKeyToPublicKey(sec) {
    const k = decodeScalar(sec, 'Invalid secret key');
    const K = ec.g.mul(k);
    return encodePoint(K);
}

function decodeScalar(buf, message = 'Invalid scalar') {
    const scalar = decodeInt(buf);
    if (scalar.gte(ec.curve.n)) {
        throw new RangeError(message);
    }
    return scalar;
}

function encodePoint(P) {
    return Buffer.from(ec.encodePoint(P));
}

export default { fastHash, reduceScalar32, secretKeyToPublicKey }
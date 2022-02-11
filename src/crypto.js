'use strict';

// MIT License
//
// Copyright (c) 2021 Coin Crypto Wallet
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
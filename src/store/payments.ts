/**
 * activePaymentRequest
 * successfulPayment[]
 * unsuccessfulPayment[]
 */

import { PaymentRequest } from "../SimplePay"

export interface Payments {
    active?: PaymentRequest
    succeeded?: PaymentRequest[]
    failed?: PaymentRequest[]
}
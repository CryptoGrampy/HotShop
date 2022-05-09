/**
 * activePaymentRequest
 * successfulPayment[]
 * unsuccessfulPayment[]
 */

import { defineStore } from "pinia"
import { PaymentRequest, PaymentResponse, PaymentStatus } from "../SimplePay"

const testHistory: PaymentResponse[] = [
]

export interface PaymentsState {
    active?: PaymentRequest
    succeeded?: PaymentResponse[]
    failed?: PaymentResponse[]
}

export const usePaymentStore = defineStore('payment', {
    state: (): PaymentsState => ({
       active: undefined,
       succeeded: [],
       failed: []
    }),
    actions: {
        createNewPayment(payment: PaymentRequest): void {
            this.$state.active = payment
        },
        clearActivePayment(): void {
            this.$state.active = undefined
        },
        saveSuccessfulPayment(payment: PaymentResponse): void  {
            this.$state.succeeded?.push(payment);
        },
        saveFailedPayment(payment: PaymentResponse): void {
            this.$state.failed?.push(payment);
        }
    }
})
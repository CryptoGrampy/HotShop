/**
 * activePaymentRequest
 * successfulPayment[]
 * unsuccessfulPayment[]
 */

import { defineStore } from "pinia";
import { PaymentRequest, PaymentResponse } from "../SimplePay";

export interface PaymentsState {
  numPadAmount: string;
  currentXmrAmount?: number;
  activeRequest: PaymentRequest;
  activeStatus: PaymentResponse;
  succeeded?: PaymentResponse[];
  failed?: PaymentResponse[];
}

export const usePaymentStore = defineStore("payment", {
  state: (): PaymentsState => ({
    numPadAmount: "0",
    activeRequest: {} as PaymentRequest,
    activeStatus: {} as PaymentResponse,
    succeeded: [],
    failed: [],
  }),
  getters: {},
  actions: {
    createNewPaymentRequest(payment: PaymentRequest): void {
      this.$state.activeRequest = payment;
    },
    clearActiveRequest(): void {
      this.$state.numPadAmount = "0";
      this.$state.activeRequest = {} as PaymentRequest;
      this.$state.activeStatus = {} as PaymentResponse;
    },
    saveSuccessfulPayment(payment: PaymentResponse): void {
      this.$state.succeeded?.push(payment);
    },
    saveFailedPayment(payment: PaymentResponse): void {
      this.$state.failed?.push(payment);
    },
  },
});

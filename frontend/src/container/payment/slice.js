import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: [],
    stats: null,
    loading: false,
    error: null
  },
  reducers: {
    // Fetch all payments
    fetchPayments: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentsSuccess: (state, action) => {
      state.loading = false;
      state.payments = Array.isArray(action.payload.data?.payments) ? action.payload.data.payments : (Array.isArray(action.payload.data) ? action.payload.data : []);
      state.pagination = action.payload.data?.pagination;
    },
    fetchPaymentsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Process payment
    processPayment: (state) => {
      state.loading = true;
      state.error = null;
    },
    processPaymentSuccess: (state) => {
      state.loading = false;
    },
    processPaymentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Refund payment
    refundPayment: (state) => {
      state.loading = true;
      state.error = null;
    },
    refundPaymentSuccess: (state) => {
      state.loading = false;
    },
    refundPaymentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch payments by order
    fetchPaymentsByOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentsByOrderSuccess: (state, action) => {
      state.loading = false;
      state.payments = Array.isArray(action.payload.data) ? action.payload.data : (action.payload.data?.payments || []);
    },
    fetchPaymentsByOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch payment statistics
    fetchPaymentStats: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload.data;
    },
    fetchPaymentStatsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchPayments, fetchPaymentsSuccess, fetchPaymentsFail,
  processPayment, processPaymentSuccess, processPaymentFail,
  refundPayment, refundPaymentSuccess, refundPaymentFail,
  fetchPaymentsByOrder, fetchPaymentsByOrderSuccess, fetchPaymentsByOrderFail,
  fetchPaymentStats, fetchPaymentStatsSuccess, fetchPaymentStatsFail
} = paymentSlice.actions;

export default paymentSlice.reducer;

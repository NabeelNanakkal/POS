import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: [],
    statistics: null,
    loading: false,
    error: null
  },
  reducers: {
    // Process payment
    processPayment: (state) => {
      state.loading = true;
      state.error = null;
    },
    processPaymentSuccess: (state, action) => {
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
      state.payments = action.payload.data;
    },
    fetchPaymentsByOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch payment statistics
    fetchPaymentStatistics: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentStatisticsSuccess: (state, action) => {
      state.loading = false;
      state.statistics = action.payload.data;
    },
    fetchPaymentStatisticsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  processPayment, processPaymentSuccess, processPaymentFail,
  refundPayment, refundPaymentSuccess, refundPaymentFail,
  fetchPaymentsByOrder, fetchPaymentsByOrderSuccess, fetchPaymentsByOrderFail,
  fetchPaymentStatistics, fetchPaymentStatisticsSuccess, fetchPaymentStatisticsFail
} = paymentSlice.actions;

export default paymentSlice.reducer;

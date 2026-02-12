import { createSlice } from '@reduxjs/toolkit';

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    discounts: [],
    loading: false,
    error: null
  },
  reducers: {
    // Fetch all discounts
    fetchDiscounts: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDiscountsSuccess: (state, action) => {
      state.loading = false;
      state.discounts = action.payload.data || action.payload;
    },
    fetchDiscountsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create discount
    createDiscount: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDiscountSuccess: (state) => {
      state.loading = false;
    },
    createDiscountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update discount
    updateDiscount: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDiscountSuccess: (state) => {
      state.loading = false;
    },
    updateDiscountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete discount
    deleteDiscount: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDiscountSuccess: (state) => {
      state.loading = false;
    },
    deleteDiscountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchDiscounts, fetchDiscountsSuccess, fetchDiscountsFail,
  createDiscount, createDiscountSuccess, createDiscountFail,
  updateDiscount, updateDiscountSuccess, updateDiscountFail,
  deleteDiscount, deleteDiscountSuccess, deleteDiscountFail
} = discountSlice.actions;

export default discountSlice.reducer;

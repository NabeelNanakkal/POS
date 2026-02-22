import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  },
  reducers: {
    // Basic Order Actions
    createOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload.data;
    },
    createOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchOrders: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Order Item Management
    addOrderItem: (state) => {
      state.loading = true;
      state.error = null;
    },
    addOrderItemSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload.data;
    },
    addOrderItemFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateOrderItem: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOrderItemSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload.data;
    },
    updateOrderItemFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeOrderItem: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeOrderItemSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload.data;
    },
    removeOrderItemFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Order Lifecycle Actions
    confirmOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    confirmOrderSuccess: (state) => {
      state.loading = false;
    },
    confirmOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    cancelOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    cancelOrderSuccess: (state) => {
      state.loading = false;
    },
    cancelOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    voidOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    voidOrderSuccess: (state) => {
      state.loading = false;
    },
    voidOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    returnOrder: (state) => {
      state.loading = true;
      state.error = null;
    },
    returnOrderSuccess: (state) => {
      state.loading = false;
    },
    returnOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  createOrder, createOrderSuccess, createOrderFail,
  fetchOrders, fetchOrdersSuccess, fetchOrdersFail,
  addOrderItem, addOrderItemSuccess, addOrderItemFail,
  updateOrderItem, updateOrderItemSuccess, updateOrderItemFail,
  removeOrderItem, removeOrderItemSuccess, removeOrderItemFail,
  confirmOrder, confirmOrderSuccess, confirmOrderFail,
  cancelOrder, cancelOrderSuccess, cancelOrderFail,
  voidOrder, voidOrderSuccess, voidOrderFail,
  returnOrder, returnOrderSuccess, returnOrderFail
} = orderSlice.actions;

export default orderSlice.reducer;

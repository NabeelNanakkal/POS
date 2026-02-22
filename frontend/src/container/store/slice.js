import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    },
    stats: {
      totalStores: 0,
      activeStores: 0,
      totalStaff: 0,
      growth: {
        value: 0,
        trend: 0
      }
    },
    loading: false,
    loading: false,
    error: null,
    paymentModes: []
  },
  reducers: {
    fetchStores: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoresSuccess: (state, action) => {
      state.loading = false;
      const { stores, pagination, stats } = action.payload.data;
      
      // Map _id to id for frontend compatibility
      state.stores = (stores || []).map(store => ({
        ...store,
        id: store._id || store.id
      }));
      state.pagination = pagination || state.pagination;
      state.stats = stats || state.stats;
    },
    fetchStoresFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    bulkCreateStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    bulkCreateStoreSuccess: (state, action) => {
      state.loading = false;
      const newStores = action.payload.data || [];
      const storesWithIds = newStores.map(store => ({
        ...store,
        id: store._id || store.id
      }));
      state.stores.push(...storesWithIds);
    },
    bulkCreateStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    createStoreSuccess: (state, action) => {
      state.loading = false;
      const newStore = action.payload.data;
      state.stores.push({ 
        ...newStore, 
        id: newStore._id || newStore.id
      });
    },
    createStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateStoreSuccess: (state, action) => {
      state.loading = false;
      const updatedStore = action.payload.data;
      const storeWithId = { 
        ...updatedStore, 
        id: updatedStore._id || updatedStore.id
      };
      
      const index = state.stores.findIndex((s) => s.id === storeWithId.id);
      if (index !== -1) {
        state.stores[index] = storeWithId;
      }
    },
    updateStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleStoreStatus: (state) => {
      state.loading = true;
      state.error = null;
    },
    toggleStoreStatusSuccess: (state, action) => {
      state.loading = false;
      const updatedStore = action.payload.data;
      const storeWithId = { 
        ...updatedStore, 
        id: updatedStore._id || updatedStore.id
      };
      
      const index = state.stores.findIndex((s) => s.id === storeWithId.id);
      if (index !== -1) {
        state.stores[index] = storeWithId;
      }
    },
    toggleStoreStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteStoreSuccess: (state, action) => {
      state.loading = false;
      state.stores = state.stores.filter((s) => s.id !== action.payload.id);
    },
    deleteStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPaymentModes: (state) => {
        state.loading = true;
    },
    fetchPaymentModesSuccess: (state, action) => {
        state.loading = false;
        console.log('fetchPaymentModesSuccess payload:', action.payload);
        state.paymentModes = action.payload.data || [];
    },
    fetchPaymentModesFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }
  }
});

export const {
  fetchStores, fetchStoresSuccess, fetchStoresFail,
  bulkCreateStore, bulkCreateStoreSuccess, bulkCreateStoreFail,
  createStore, createStoreSuccess, createStoreFail,
  updateStore, updateStoreSuccess, updateStoreFail,
  toggleStoreStatus, toggleStoreStatusSuccess, toggleStoreStatusFail,
  deleteStore, deleteStoreSuccess, deleteStoreFail,
  fetchPaymentModes, fetchPaymentModesSuccess, fetchPaymentModesFail
} = storeSlice.actions;

export default storeSlice.reducer;

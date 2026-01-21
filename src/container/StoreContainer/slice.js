import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchStores: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoresSuccess: (state, action) => {
      state.loading = false;
      state.stores = action.payload.data || [];
    },
    fetchStoresFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setStoresBulk: (state, action) => {
       const newStores = action.payload.map((item, index) => ({
        id: Date.now() + index,
        name: item.Name || item.name,
        code: item.Code || item.code || `STR${index + 1}`,
        location: item.Location || item.location || 'Unknown',
        status: item.Status || item.status || 'Active',
        active: true
      }));
      state.stores = newStores;
    },
    createStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    createStoreSuccess: (state, action) => {
      state.loading = false;
      state.stores.push(action.payload.data);
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
      const index = state.stores.findIndex((s) => s.id === action.payload.data.id);
      if (index !== -1) {
        state.stores[index] = action.payload.data;
      }
    },
    updateStoreFail: (state, action) => {
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
    }
  }
});

export const {
  fetchStores, fetchStoresSuccess, fetchStoresFail,
  setStoresBulk,
  createStore, createStoreSuccess, createStoreFail,
  updateStore, updateStoreSuccess, updateStoreFail,
  deleteStore, deleteStoreSuccess, deleteStoreFail
} = storeSlice.actions;

export default storeSlice.reducer;

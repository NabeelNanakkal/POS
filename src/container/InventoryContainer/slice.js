import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventoryList: [],
    lowStockItems: [],
    loading: false,
    error: null
  },
  reducers: {
    // Create inventory record
    createInventoryRecord: (state) => {
      state.loading = true;
      state.error = null;
    },
    createInventoryRecordSuccess: (state) => {
      state.loading = false;
    },
    createInventoryRecordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch inventory by store
    fetchInventoryByStore: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventoryByStoreSuccess: (state, action) => {
      state.loading = false;
      state.inventoryList = action.payload.data;
    },
    fetchInventoryByStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch low stock items
    fetchLowStockItems: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLowStockItemsSuccess: (state, action) => {
      state.loading = false;
      state.lowStockItems = action.payload.data;
    },
    fetchLowStockItemsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Adjust inventory quantity
    adjustInventoryQuantity: (state) => {
      state.loading = true;
      state.error = null;
    },
    adjustInventoryQuantitySuccess: (state) => {
      state.loading = false;
    },
    adjustInventoryQuantityFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  createInventoryRecord, createInventoryRecordSuccess, createInventoryRecordFail,
  fetchInventoryByStore, fetchInventoryByStoreSuccess, fetchInventoryByStoreFail,
  fetchLowStockItems, fetchLowStockItemsSuccess, fetchLowStockItemsFail,
  adjustInventoryQuantity, adjustInventoryQuantitySuccess, adjustInventoryQuantityFail
} = inventorySlice.actions;

export default inventorySlice.reducer;

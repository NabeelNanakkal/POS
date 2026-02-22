import { createSlice } from '@reduxjs/toolkit';

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    salesReport: null,
    productReport: null,
    inventoryReport: null,
    loading: false,
    error: null
  },
  reducers: {
    fetchSalesReport: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSalesReportSuccess: (state, action) => {
      state.loading = false;
      state.salesReport = action.payload.data;
    },
    fetchSalesReportFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchProductReport: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductReportSuccess: (state, action) => {
      state.loading = false;
      state.productReport = action.payload.data;
    },
    fetchProductReportFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchInventoryReport: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventoryReportSuccess: (state, action) => {
      state.loading = false;
      state.inventoryReport = action.payload.data;
    },
    fetchInventoryReportFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchSalesReport, fetchSalesReportSuccess, fetchSalesReportFail,
  fetchProductReport, fetchProductReportSuccess, fetchProductReportFail,
  fetchInventoryReport, fetchInventoryReportSuccess, fetchInventoryReportFail
} = reportSlice.actions;

export default reportSlice.reducer;

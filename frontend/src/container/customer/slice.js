import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers: [],
    customer: null,
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
    // Create customer
    createCustomer: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCustomerSuccess: (state, action) => {
      state.loading = false;
      state.customer = action.payload.data;
    },
    createCustomerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch all customers
    fetchCustomers: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomersSuccess: (state, action) => {
      state.loading = false;
      state.customers = Array.isArray(action.payload.data?.customers) ? action.payload.data.customers : [];
      state.pagination = action.payload.data?.pagination || action.payload.pagination;
    },
    fetchCustomersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch customer by ID
    fetchCustomerById: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomerByIdSuccess: (state, action) => {
      state.loading = false;
      state.customer = action.payload.data;
    },
    fetchCustomerByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch customer by phone
    fetchCustomerByPhone: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomerByPhoneSuccess: (state, action) => {
      state.loading = false;
      state.customer = action.payload.data;
    },
    fetchCustomerByPhoneFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Search customers
    searchCustomers: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchCustomersSuccess: (state, action) => {
      state.loading = false;
      state.customers = Array.isArray(action.payload.data?.customers) ? action.payload.data.customers : [];
      state.pagination = action.payload.data?.pagination || action.payload.pagination;
    },
    searchCustomersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete customer
    deleteCustomer: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCustomerSuccess: (state, action) => {
      state.loading = false;
      state.customers = state.customers.filter(c => c._id !== action.payload.data._id);
    },
    deleteCustomerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update customer
    updateCustomer: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCustomerSuccess: (state, action) => {
      state.loading = false;
      state.customers = state.customers.map(c => 
        (c._id === action.payload.data._id || c.id === action.payload.data.id) ? action.payload.data : c
      );
    },
    updateCustomerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  createCustomer, createCustomerSuccess, createCustomerFail,
  fetchCustomers, fetchCustomersSuccess, fetchCustomersFail,
  fetchCustomerById, fetchCustomerByIdSuccess, fetchCustomerByIdFail,
  fetchCustomerByPhone, fetchCustomerByPhoneSuccess, fetchCustomerByPhoneFail,
  searchCustomers, searchCustomersSuccess, searchCustomersFail,
  deleteCustomer, deleteCustomerSuccess, deleteCustomerFail,
  updateCustomer, updateCustomerSuccess, updateCustomerFail
} = customerSlice.actions;

export default customerSlice.reducer;

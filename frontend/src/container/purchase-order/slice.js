import { createSlice } from '@reduxjs/toolkit';

const poSlice = createSlice({
  name: 'po',
  initialState: {
    pos: [],
    po: null,
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
    // Fetch all POs
    fetchPOs: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPOsSuccess: (state, action) => {
      state.loading = false;
      state.pos = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchPOsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch PO by ID
    fetchPOById: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPOByIdSuccess: (state, action) => {
      state.loading = false;
      state.po = action.payload.data;
    },
    fetchPOByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create PO
    createPO: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPOSuccess: (state) => {
      state.loading = false;
    },
    createPOFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update PO
    updatePO: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePOSuccess: (state) => {
      state.loading = false;
    },
    updatePOFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete PO
    deletePO: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePOSuccess: (state) => {
      state.loading = false;
    },
    deletePOFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchPOs, fetchPOsSuccess, fetchPOsFail,
  fetchPOById, fetchPOByIdSuccess, fetchPOByIdFail,
  createPO, createPOSuccess, createPOFail,
  updatePO, updatePOSuccess, updatePOFail,
  deletePO, deletePOSuccess, deletePOFail
} = poSlice.actions;

export default poSlice.reducer;

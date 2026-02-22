import { createSlice } from '@reduxjs/toolkit';

const shiftSlice = createSlice({
  name: 'shift',
  initialState: {
    currentShift: null,
    shiftSummary: null,
    loading: false,
    error: null
  },
  reducers: {
    // Open cash shift
    openShift: (state) => {
      state.loading = true;
      state.error = null;
    },
    openShiftSuccess: (state, action) => {
      state.loading = false;
      state.currentShift = action.payload.data;
    },
    openShiftFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Close cash shift
    closeShift: (state) => {
      state.loading = true;
      state.error = null;
    },
    closeShiftSuccess: (state) => {
      state.loading = false;
      state.currentShift = null;
    },
    closeShiftFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get current open shift
    fetchCurrentShift: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCurrentShiftSuccess: (state, action) => {
      state.loading = false;
      state.currentShift = action.payload.data;
    },
    fetchCurrentShiftFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get shift summary
    fetchShiftSummary: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchShiftSummarySuccess: (state, action) => {
      state.loading = false;
      state.shiftSummary = action.payload.data;
    },
    fetchShiftSummaryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Break actions
    startBreak: (state) => {
      state.loading = true;
      state.error = null;
    },
    startBreakSuccess: (state, action) => {
      state.loading = false;
      state.currentShift = action.payload.data;
    },
    startBreakFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    endBreak: (state) => {
      state.loading = true;
      state.error = null;
    },
    endBreakSuccess: (state, action) => {
      state.loading = false;
      state.currentShift = action.payload.data;
    },
    endBreakFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  openShift, openShiftSuccess, openShiftFail,
  closeShift, closeShiftSuccess, closeShiftFail,
  fetchCurrentShift, fetchCurrentShiftSuccess, fetchCurrentShiftFail,
  fetchShiftSummary, fetchShiftSummarySuccess, fetchShiftSummaryFail,
  startBreak, startBreakSuccess, startBreakFail,
  endBreak, endBreakSuccess, endBreakFail
} = shiftSlice.actions;

export default shiftSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    presignedUrl: null,
    loading: false,
    error: null
  },
  reducers: {
    generatePresignedUrl: (state) => {
      state.loading = true;
      state.error = null;
    },
    generatePresignedUrlSuccess: (state, action) => {
      state.loading = false;
      state.presignedUrl = action.payload.data;
    },
    generatePresignedUrlFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  generatePresignedUrl,
  generatePresignedUrlSuccess,
  generatePresignedUrlFail
} = uploadSlice.actions;

export default uploadSlice.reducer;

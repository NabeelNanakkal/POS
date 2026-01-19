import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  reducers: {
    // Fetch all categories
    fetchCategories: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload.data;
    },
    fetchCategoriesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create category
    createCategory: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCategorySuccess: (state) => {
      state.loading = false;
    },
    createCategoryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFail,
  createCategory, createCategorySuccess, createCategoryFail
} = categorySlice.actions;

export default categorySlice.reducer;

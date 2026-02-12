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
    createCategorySuccess: (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        state.categories.push(action.payload.data);
      }
    },
    createCategoryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update category
    updateCategory: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.map(c => 
        (c._id === action.payload.data._id || c.id === action.payload.data.id) ? action.payload.data : c
      );
    },
    updateCategoryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete category
    deleteCategory: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(c => c._id !== action.payload.data._id);
    },
    deleteCategoryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFail,
  createCategory, createCategorySuccess, createCategoryFail,
  updateCategory, updateCategorySuccess, updateCategoryFail,
  deleteCategory, deleteCategorySuccess, deleteCategoryFail
} = categorySlice.actions;

export default categorySlice.reducer;

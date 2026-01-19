import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
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
    // Fetch all products
    fetchProducts: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch product by ID
    fetchProductById: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductByIdSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload.data;
    },
    fetchProductByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create product
    createProduct: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess: (state) => {
      state.loading = false;
    },
    createProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update product
    updateProduct: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess: (state) => {
      state.loading = false;
    },
    updateProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete product
    deleteProduct: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state) => {
      state.loading = false;
    },
    deleteProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Search products
    searchProducts: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    searchProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchProducts, fetchProductsSuccess, fetchProductsFail,
  fetchProductById, fetchProductByIdSuccess, fetchProductByIdFail,
  createProduct, createProductSuccess, createProductFail,
  updateProduct, updateProductSuccess, updateProductFail,
  deleteProduct, deleteProductSuccess, deleteProductFail,
  searchProducts, searchProductsSuccess, searchProductsFail
} = productSlice.actions;

export default productSlice.reducer;

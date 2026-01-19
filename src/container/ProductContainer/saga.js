import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchProducts, fetchProductsSuccess, fetchProductsFail,
  fetchProductById, fetchProductByIdSuccess, fetchProductByIdFail,
  createProduct, createProductSuccess, createProductFail,
  updateProduct, updateProductSuccess, updateProductFail,
  deleteProduct, deleteProductSuccess, deleteProductFail,
  searchProducts, searchProductsSuccess, searchProductsFail
} from './slice';

function* getProducts(action) {
  try {
    const { companyId, page, limit } = action.payload;
    const params = {
      api: `${config.ip}/products?companyId=${companyId}&page=${page}&limit=${limit}`,
      method: 'GET',
      successAction: fetchProductsSuccess(),
      failAction: fetchProductsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch products failed:', error);
  }
}

function* getProductById(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/products/${id}`,
      method: 'GET',
      successAction: fetchProductByIdSuccess(),
      failAction: fetchProductByIdFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch product by id failed:', error);
  }
}

function* addProduct(action) {
  try {
    const params = {
      api: `${config.ip}/products`,
      method: 'POST',
      successAction: createProductSuccess(),
      failAction: createProductFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create product failed:', error);
  }
}

function* editProduct(action) {
  try {
    const { id, ...data } = action.payload;
    const params = {
      api: `${config.ip}/products/${id}`,
      method: 'PUT',
      successAction: updateProductSuccess(),
      failAction: updateProductFail(),
      body: JSON.stringify(data),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Update product failed:', error);
  }
}

function* removeProduct(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/products/${id}`,
      method: 'DELETE',
      successAction: deleteProductSuccess(),
      failAction: deleteProductFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Delete product failed:', error);
  }
}

function* findProducts(action) {
  try {
    const { query } = action.payload;
    const params = {
      api: `${config.ip}/products/search?q=${query}`,
      method: 'GET',
      successAction: searchProductsSuccess(),
      failAction: searchProductsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Search products failed:', error);
  }
}

export default function* ProductActionWatcher() {
  yield takeEvery(fetchProducts.type, getProducts);
  yield takeEvery(fetchProductById.type, getProductById);
  yield takeEvery(createProduct.type, addProduct);
  yield takeEvery(updateProduct.type, editProduct);
  yield takeEvery(deleteProduct.type, removeProduct);
  yield takeEvery(searchProducts.type, findProducts);
}

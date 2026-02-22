import { takeEvery, call, put } from 'redux-saga/effects';
import productService from '../../services/product.service';
import { toast } from 'react-toastify';
import {
  fetchProducts, fetchProductsSuccess, fetchProductsFail,
  fetchProductById, fetchProductByIdSuccess, fetchProductByIdFail,
  createProduct, createProductSuccess, createProductFail,
  updateProduct, updateProductSuccess, updateProductFail,
  deleteProduct, deleteProductSuccess, deleteProductFail,
  searchProducts, searchProductsSuccess, searchProductsFail,
  bulkCreateProducts, bulkCreateProductsSuccess, bulkCreateProductsFail,
  fetchProductStats, fetchProductStatsSuccess, fetchProductStatsFail,
  adjustStock, adjustStockSuccess, adjustStockFail
} from './slice';

function* getProducts(action) {
  try {
    const { page = 1, limit = 10, search, category, isActive } = action.payload || {};
    
    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
      ...(isActive !== undefined && { isActive })
    };

    const response = yield call(productService.getProducts, params);
    
    if (response && response.data) {
      yield put(fetchProductsSuccess({
        data: response.data.products,
        pagination: response.data.pagination
      }));
    }
  } catch (error) {
    console.error('Fetch products failed:', error);
    yield put(fetchProductsFail(error.message));
    toast.error(error.message || 'Failed to fetch products');
  }
}

function* getProductById(action) {
  try {
    const { id } = action.payload;
    const response = yield call(productService.getProductById, id);
    
    if (response && response.data) {
      yield put(fetchProductByIdSuccess({ data: response.data }));
    }
  } catch (error) {
    console.error('Fetch product by id failed:', error);
    yield put(fetchProductByIdFail(error.message));
    toast.error(error.message || 'Failed to fetch product');
  }
}

function* addProduct(action) {
  try {
    const response = yield call(productService.createProduct, action.payload);
    
    if (response && response.data) {
      yield put(createProductSuccess());
      toast.success('Product created successfully');
      
      // Optionally refetch products list
      if (action.payload.refetch) {
        yield put(fetchProducts({ page: 1, limit: 10 }));
      }
    }
  } catch (error) {
    console.error('Create product failed:', error);
    yield put(createProductFail(error.message));
    toast.error(error.message || 'Failed to create product');
  }
}

function* editProduct(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(productService.updateProduct, id, data);
    
    if (response && response.data) {
      yield put(updateProductSuccess());
      toast.success('Product updated successfully');
      
      // Optionally refetch products list
      if (action.payload.refetch) {
        yield put(fetchProducts({ page: 1, limit: 10 }));
      }
    }
  } catch (error) {
    console.error('Update product failed:', error);
    yield put(updateProductFail(error.message));
    toast.error(error.message || 'Failed to update product');
  }
}

function* removeProduct(action) {
  try {
    const { id } = action.payload;
    yield call(productService.deleteProduct, id);
    
    yield put(deleteProductSuccess());
    toast.success('Product deleted successfully');
    
    // Refetch products list
    yield put(fetchProducts({ page: 1, limit: 10 }));
    yield put(fetchProductStats());
  } catch (error) {
    console.error('Delete product failed:', error);
    yield put(deleteProductFail(error.message));
    toast.error(error.message || 'Failed to delete product');
  }
}

function* findProducts(action) {
  try {
    const { query, ...otherParams } = action.payload;
    
    const params = {
      search: query,
      ...otherParams
    };

    const response = yield call(productService.getProducts, params);
    
    if (response && response.data) {
      yield put(searchProductsSuccess({
        data: response.data.products,
        pagination: response.data.pagination
      }));
    }
  } catch (error) {
    console.error('Search products failed:', error);
    yield put(searchProductsFail(error.message));
    toast.error(error.message || 'Failed to search products');
  }
}

function* bulkAddProducts(action) {
  try {
    const response = yield call(productService.bulkCreateProducts, action.payload.products);
    
    if (response && response.data) {
      yield put(bulkCreateProductsSuccess());
      toast.success(response.message || 'Products imported successfully');
      
      // Refetch products list
      yield put(fetchProducts({ page: 1, limit: 10 }));
      yield put(fetchProductStats());
    }
  } catch (error) {
    console.error('Bulk create products failed:', error);
    yield put(bulkCreateProductsFail(error.message));
    toast.error(error.message || 'Failed to import products');
  }
}

function* adjustStockSaga(action) {
  try {
    const { id, type, quantity, reason } = action.payload;
    const response = yield call(productService.adjustStock, id, { type, quantity, reason });
    
    if (response && response.data) {
      yield put(adjustStockSuccess());
      toast.success('Stock adjusted successfully');
      
      // Refetch products to update UI
      yield put(fetchProducts({ page: 1, limit: 10 }));
      yield put(fetchProductStats());
    }
  } catch (error) {
    console.error('Adjust stock failed:', error);
    yield put(adjustStockFail(error.message));
    toast.error(error.message || 'Failed to adjust stock');
  }
}

function* getProductStatsSaga() {
  try {
    const response = yield call(productService.getProductStats);
    if (response && response.data) {
      yield put(fetchProductStatsSuccess({ data: response.data }));
    }
  } catch (error) {
    console.error('Fetch product stats failed:', error);
    yield put(fetchProductStatsFail(error.message));
  }
}

export default function* ProductActionWatcher() {
  yield takeEvery(fetchProducts.type, getProducts);
  yield takeEvery(fetchProductById.type, getProductById);
  yield takeEvery(createProduct.type, addProduct);
  yield takeEvery(updateProduct.type, editProduct);
  yield takeEvery(deleteProduct.type, removeProduct);
  yield takeEvery(searchProducts.type, findProducts);
  yield takeEvery(bulkCreateProducts.type, bulkAddProducts);
  yield takeEvery(fetchProductStats.type, getProductStatsSaga);
  yield takeEvery(adjustStock.type, adjustStockSaga);
}

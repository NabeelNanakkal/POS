import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchStores, fetchStoresSuccess, fetchStoresFail,
  createStore, createStoreSuccess, createStoreFail,
  updateStore, updateStoreSuccess, updateStoreFail,
  deleteStore, deleteStoreSuccess, deleteStoreFail,
  toggleStoreStatus, toggleStoreStatusSuccess, toggleStoreStatusFail,
  bulkCreateStore, bulkCreateStoreSuccess, bulkCreateStoreFail
} from './slice';

import { toast } from 'react-toastify';

function* getStores(action) {
  try {
    const { search, page = 1, limit = 10, isActive } = action.payload || {};
    let queryString = `?page=${page}&limit=${limit}`;
    
    if (search) queryString += `&search=${encodeURIComponent(search)}`;
    if (isActive !== undefined && isActive !== 'All') {
      queryString += `&isActive=${isActive === 'Active'}`;
    }

    const params = {
      api: `${config.ip}/stores${queryString}`,
      method: 'GET',
      successAction: fetchStoresSuccess(),
      failAction: fetchStoresFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch stores failed:', error);
    toast.error('Failed to load stores');
  }
}

function* postStore(action) {
  try {
    const params = {
      api: `${config.ip}/stores`,
      method: 'POST',
      successAction: createStoreSuccess(),
      failAction: createStoreFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Store created successfully');
    yield put(fetchStores());
  } catch (error) {
    console.error('Create store failed:', error);
    toast.error(error.message || 'Failed to create store');
  }
}

function* putStore(action) {
  try {
    const { id, ...data } = action.payload;
    const params = {
      api: `${config.ip}/stores/${id}`,
      method: 'PUT',
      successAction: updateStoreSuccess(),
      failAction: updateStoreFail(),
      body: JSON.stringify(data),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Store updated successfully');
    yield put(fetchStores());
  } catch (error) {
    console.error('Update store failed:', error);
    toast.error(error.message || 'Failed to update store');
  }
}

function* removeStore(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/stores/${id}`,
      method: 'DELETE',
      successAction: deleteStoreSuccess({ id }),
      failAction: deleteStoreFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Store deleted successfully');
    yield put(fetchStores());
  } catch (error) {
    console.error('Delete store failed:', error);
    toast.error(error.message || 'Failed to delete store');
  }
}

function* patchStoreStatus(action) {
  try {
    const { id, isActive } = action.payload;
    const params = {
      api: `${config.ip}/stores/${id}/status`,
      method: 'PATCH',
      successAction: toggleStoreStatusSuccess(),
      failAction: toggleStoreStatusFail(),
      body: JSON.stringify({ isActive }),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Store status updated successfully');
    yield put(fetchStores());
  } catch (error) {
    console.error('Toggle store status failed:', error);
    toast.error(error.message || 'Failed to update store status');
  }
}

function* postBulkStores(action) {
  try {
    const params = {
      api: `${config.ip}/stores/bulk`,
      method: 'POST',
      successAction: bulkCreateStoreSuccess(),
      failAction: bulkCreateStoreFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Stores imported successfully');
    yield put(fetchStores());
  } catch (error) {
    console.error('Bulk import failed:', error);
    toast.error(error.message || 'Failed to import stores');
  }
}

export default function* StoreActionWatcher() {
  yield takeEvery(fetchStores.type, getStores);
  yield takeEvery(createStore.type, postStore);
  yield takeEvery(updateStore.type, putStore);
  yield takeEvery(deleteStore.type, removeStore);
  yield takeEvery(toggleStoreStatus.type, patchStoreStatus);
  yield takeEvery(bulkCreateStore.type, postBulkStores);
}

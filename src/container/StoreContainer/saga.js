import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchStores, fetchStoresSuccess, fetchStoresFail,
  createStore, createStoreSuccess, createStoreFail,
  updateStore, updateStoreSuccess, updateStoreFail,
  deleteStore, deleteStoreSuccess, deleteStoreFail
} from './slice';

function* getStores() {
  try {
    const params = {
      api: `${config.ip}/stores`,
      method: 'GET',
      successAction: fetchStoresSuccess(),
      failAction: fetchStoresFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch stores failed:', error);
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
  } catch (error) {
    console.error('Create store failed:', error);
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
  } catch (error) {
    console.error('Update store failed:', error);
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
  } catch (error) {
    console.error('Delete store failed:', error);
  }
}

export default function* StoreActionWatcher() {
  yield takeEvery(fetchStores.type, getStores);
  yield takeEvery(createStore.type, postStore);
  yield takeEvery(updateStore.type, putStore);
  yield takeEvery(deleteStore.type, removeStore);
}

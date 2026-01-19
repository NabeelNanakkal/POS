import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  createInventoryRecord, createInventoryRecordSuccess, createInventoryRecordFail,
  fetchInventoryByStore, fetchInventoryByStoreSuccess, fetchInventoryByStoreFail,
  fetchLowStockItems, fetchLowStockItemsSuccess, fetchLowStockItemsFail,
  adjustInventoryQuantity, adjustInventoryQuantitySuccess, adjustInventoryQuantityFail
} from './slice';

function* addInventoryRecord(action) {
  try {
    const params = {
      api: `${config.ip}/inventory`,
      method: 'POST',
      successAction: createInventoryRecordSuccess(),
      failAction: createInventoryRecordFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create inventory record failed:', error);
  }
}

function* getInventoryByStore(action) {
  try {
    const { storeId } = action.payload;
    const params = {
      api: `${config.ip}/inventory/store/${storeId}`,
      method: 'GET',
      successAction: fetchInventoryByStoreSuccess(),
      failAction: fetchInventoryByStoreFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch inventory by store failed:', error);
  }
}

function* getLowStockItems() {
  try {
    const params = {
      api: `${config.ip}/inventory/low-stock`,
      method: 'GET',
      successAction: fetchLowStockItemsSuccess(),
      failAction: fetchLowStockItemsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch low stock items failed:', error);
  }
}

function* adjustQuantity(action) {
  try {
    const params = {
      api: `${config.ip}/inventory/adjust`,
      method: 'POST',
      successAction: adjustInventoryQuantitySuccess(),
      failAction: adjustInventoryQuantityFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Adjust inventory quantity failed:', error);
  }
}

export default function* InventoryActionWatcher() {
  yield takeEvery(createInventoryRecord.type, addInventoryRecord);
  yield takeEvery(fetchInventoryByStore.type, getInventoryByStore);
  yield takeEvery(fetchLowStockItems.type, getLowStockItems);
  yield takeEvery(adjustInventoryQuantity.type, adjustQuantity);
}

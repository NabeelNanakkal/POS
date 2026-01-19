import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchPOs, fetchPOsSuccess, fetchPOsFail,
  fetchPOById, fetchPOByIdSuccess, fetchPOByIdFail,
  createPO, createPOSuccess, createPOFail,
  updatePO, updatePOSuccess, updatePOFail,
  deletePO, deletePOSuccess, deletePOFail
} from './slice';

function* getPOs(action) {
  try {
    const { page, limit } = action.payload || { page: 1, limit: 10 };
    const params = {
      api: `${config.ip}/pos?page=${page}&limit=${limit}`,
      method: 'GET',
      successAction: fetchPOsSuccess(),
      failAction: fetchPOsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch POs failed:', error);
  }
}

function* getPOById(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/pos/${id}`,
      method: 'GET',
      successAction: fetchPOByIdSuccess(),
      failAction: fetchPOByIdFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch PO by id failed:', error);
  }
}

function* addPO(action) {
  try {
    const params = {
      api: `${config.ip}/pos`,
      method: 'POST',
      successAction: createPOSuccess(),
      failAction: createPOFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create PO failed:', error);
  }
}

function* editPO(action) {
  try {
    const { id, ...data } = action.payload;
    const params = {
      api: `${config.ip}/pos/${id}`,
      method: 'PUT',
      successAction: updatePOSuccess(),
      failAction: updatePOFail(),
      body: JSON.stringify(data),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Update PO failed:', error);
  }
}

function* removePO(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/pos/${id}`,
      method: 'DELETE',
      successAction: deletePOSuccess(),
      failAction: deletePOFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Delete PO failed:', error);
  }
}

export default function* POActionWatcher() {
  yield takeEvery(fetchPOs.type, getPOs);
  yield takeEvery(fetchPOById.type, getPOById);
  yield takeEvery(createPO.type, addPO);
  yield takeEvery(updatePO.type, editPO);
  yield takeEvery(deletePO.type, removePO);
}

import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  createCustomer, createCustomerSuccess, createCustomerFail,
  fetchCustomers, fetchCustomersSuccess, fetchCustomersFail,
  fetchCustomerById, fetchCustomerByIdSuccess, fetchCustomerByIdFail,
  fetchCustomerByPhone, fetchCustomerByPhoneSuccess, fetchCustomerByPhoneFail,
  searchCustomers, searchCustomersSuccess, searchCustomersFail
} from './slice';

function* postCustomer(action) {
  try {
    const params = {
      api: `${config.ip}/customers`,
      method: 'POST',
      successAction: createCustomerSuccess(),
      failAction: createCustomerFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create customer failed:', error);
  }
}

function* getCustomers(action) {
  try {
    const { page, limit } = action.payload || { page: 1, limit: 10 };
    const params = {
      api: `${config.ip}/customers?page=${page}&limit=${limit}`,
      method: 'GET',
      successAction: fetchCustomersSuccess(),
      failAction: fetchCustomersFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch customers failed:', error);
  }
}

function* getCustomerById(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/customers/${id}`,
      method: 'GET',
      successAction: fetchCustomerByIdSuccess(),
      failAction: fetchCustomerByIdFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch customer by ID failed:', error);
  }
}

function* getCustomerByPhone(action) {
  try {
    const { phone } = action.payload;
    const params = {
      api: `${config.ip}/customers/phone/${phone}`,
      method: 'GET',
      successAction: fetchCustomerByPhoneSuccess(),
      failAction: fetchCustomerByPhoneFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch customer by phone failed:', error);
  }
}

function* findCustomers(action) {
  try {
    const { query } = action.payload;
    const params = {
      api: `${config.ip}/customers/search?q=${query}`,
      method: 'GET',
      successAction: searchCustomersSuccess(),
      failAction: searchCustomersFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Search customers failed:', error);
  }
}

export default function* CustomerActionWatcher() {
  yield takeEvery(createCustomer.type, postCustomer);
  yield takeEvery(fetchCustomers.type, getCustomers);
  yield takeEvery(fetchCustomerById.type, getCustomerById);
  yield takeEvery(fetchCustomerByPhone.type, getCustomerByPhone);
  yield takeEvery(searchCustomers.type, findCustomers);
}

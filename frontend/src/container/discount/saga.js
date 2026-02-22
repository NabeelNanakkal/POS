import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../api';
import config from '../../config';
import {
  fetchDiscounts, fetchDiscountsSuccess, fetchDiscountsFail,
  createDiscount, createDiscountSuccess, createDiscountFail,
  updateDiscount, updateDiscountSuccess, updateDiscountFail,
  deleteDiscount, deleteDiscountSuccess, deleteDiscountFail
} from './slice';

function* getDiscounts() {
  try {
    const params = {
      api: `${config.ip}/discounts`,
      method: 'GET',
      successAction: fetchDiscountsSuccess(),
      failAction: fetchDiscountsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch discounts failed:', error);
  }
}

function* addDiscount(action) {
  try {
    const params = {
      api: `${config.ip}/discounts`,
      method: 'POST',
      successAction: createDiscountSuccess(),
      failAction: createDiscountFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Discount created successfully!');
    // Refetch discounts after creation
    yield call(getDiscounts);
  } catch (error) {
    console.error('Create discount failed:', error);
    toast.error(error.message || 'Failed to create discount');
  }
}

function* modifyDiscount(action) {
  try {
    const { id, ...data } = action.payload;
    const params = {
      api: `${config.ip}/discounts/${id}`,
      method: 'PUT',
      successAction: updateDiscountSuccess(),
      failAction: updateDiscountFail(),
      body: JSON.stringify(data),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Discount updated successfully!');
    // Refetch discounts after update
    yield call(getDiscounts);
  } catch (error) {
    console.error('Update discount failed:', error);
    toast.error(error.message || 'Failed to update discount');
  }
}

function* removeDiscount(action) {
  try {
    const params = {
      api: `${config.ip}/discounts/${action.payload.id}`,
      method: 'DELETE',
      successAction: deleteDiscountSuccess(),
      failAction: deleteDiscountFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
    toast.success('Discount deleted successfully!');
    // Refetch discounts after deletion
    yield call(getDiscounts);
  } catch (error) {
    console.error('Delete discount failed:', error);
    toast.error(error.message || 'Failed to delete discount');
  }
}

export default function* DiscountActionWatcher() {
  yield takeEvery(fetchDiscounts.type, getDiscounts);
  yield takeEvery(createDiscount.type, addDiscount);
  yield takeEvery(updateDiscount.type, modifyDiscount);
  yield takeEvery(deleteDiscount.type, removeDiscount);
}

// Payment Saga
import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchPayments, fetchPaymentsSuccess, fetchPaymentsFail,
  processPayment, processPaymentSuccess, processPaymentFail,
  refundPayment, refundPaymentSuccess, refundPaymentFail,
  fetchPaymentsByOrder, fetchPaymentsByOrderSuccess, fetchPaymentsByOrderFail,
  fetchPaymentStats, fetchPaymentStatsSuccess, fetchPaymentStatsFail
} from './slice';

function* postPayment(action) {
  try {
    const params = {
      api: `${config.ip}/payments`,
      method: 'POST',
      successAction: processPaymentSuccess(),
      failAction: processPaymentFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Process payment failed:', error);
  }
}

function* postRefund(action) {
  try {
    const params = {
      api: `${config.ip}/payments/refund`,
      method: 'POST',
      successAction: refundPaymentSuccess(),
      failAction: refundPaymentFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Refund payment failed:', error);
  }
}

function* getPayments() {
  try {
    const params = {
      api: `${config.ip}/payments`,
      method: 'GET',
      successAction: fetchPaymentsSuccess(),
      failAction: fetchPaymentsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch payments failed:', error);
  }
}

function* getPaymentsByOrder(action) {
  try {
    const { orderId } = action.payload;
    const params = {
      api: `${config.ip}/payments/order/${orderId}`,
      method: 'GET',
      successAction: fetchPaymentsByOrderSuccess(),
      failAction: fetchPaymentsByOrderFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch payments by order failed:', error);
  }
}

function* getPaymentStats() {
  try {
    const params = {
      api: `${config.ip}/payments/statistics`,
      method: 'GET',
      successAction: fetchPaymentStatsSuccess(),
      failAction: fetchPaymentStatsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch payment statistics failed:', error);
  }
}

export default function* PaymentActionWatcher() {
  yield takeEvery(processPayment.type, postPayment);
  yield takeEvery(refundPayment.type, postRefund);
  yield takeEvery(fetchPayments.type, getPayments);
  yield takeEvery(fetchPaymentsByOrder.type, getPaymentsByOrder);
  yield takeEvery(fetchPaymentStats.type, getPaymentStats);
}
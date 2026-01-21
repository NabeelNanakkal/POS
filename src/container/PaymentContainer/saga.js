import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  processPayment, processPaymentSuccess, processPaymentFail,
  refundPayment, refundPaymentSuccess, refundPaymentFail,
  fetchPaymentsByOrder, fetchPaymentsByOrderSuccess, fetchPaymentsByOrderFail,
  fetchPaymentStatistics, fetchPaymentStatisticsSuccess, fetchPaymentStatisticsFail
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

function* getPaymentStatistics() {
  try {
    const params = {
      api: `${config.ip}/payments/statistics`,
      method: 'GET',
      successAction: fetchPaymentStatisticsSuccess(),
      failAction: fetchPaymentStatisticsFail(),
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
  yield takeEvery(fetchPaymentsByOrder.type, getPaymentsByOrder);
  yield takeEvery(fetchPaymentStatistics.type, getPaymentStatistics);
}
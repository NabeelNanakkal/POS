import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchSalesReport, fetchSalesReportSuccess, fetchSalesReportFail,
  fetchProductReport, fetchProductReportSuccess, fetchProductReportFail,
  fetchInventoryReport, fetchInventoryReportSuccess, fetchInventoryReportFail
} from './slice';

function* getSalesReport(action) {
  try {
    const { storeId, startDate, endDate, period, page, limit } = action.payload;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (period) queryParams.append('period', period);
    if (storeId) queryParams.append('storeId', storeId);
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);

    const url = `${config.ip}/reports/sales?${queryParams.toString()}`;
    
    const params = {
      api: url,
      method: 'GET',
      successAction: fetchSalesReportSuccess(),
      failAction: fetchSalesReportFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch sales report failed:', error);
  }
}

function* getProductReport() {
  try {
    const params = {
      api: `${config.ip}/reports/products`,
      method: 'GET',
      successAction: fetchProductReportSuccess(),
      failAction: fetchProductReportFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch product report failed:', error);
  }
}

function* getInventoryReport() {
  try {
    const params = {
      api: `${config.ip}/reports/inventory`,
      method: 'GET',
      successAction: fetchInventoryReportSuccess(),
      failAction: fetchInventoryReportFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch inventory report failed:', error);
  }
}

export default function* ReportActionWatcher() {
  yield takeEvery(fetchSalesReport.type, getSalesReport);
  yield takeEvery(fetchProductReport.type, getProductReport);
  yield takeEvery(fetchInventoryReport.type, getInventoryReport);
}

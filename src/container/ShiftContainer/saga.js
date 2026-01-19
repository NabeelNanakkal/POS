import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  openShift, openShiftSuccess, openShiftFail,
  closeShift, closeShiftSuccess, closeShiftFail,
  fetchCurrentShift, fetchCurrentShiftSuccess, fetchCurrentShiftFail,
  fetchShiftSummary, fetchShiftSummarySuccess, fetchShiftSummaryFail
} from './slice';

function* postOpenShift(action) {
  try {
    const params = {
      api: `${config.ip}/shifts/open`,
      method: 'POST',
      successAction: openShiftSuccess(),
      failAction: openShiftFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Open shift failed:', error);
  }
}

function* postCloseShift(action) {
  try {
    const params = {
      api: `${config.ip}/shifts/close`,
      method: 'POST',
      successAction: closeShiftSuccess(),
      failAction: closeShiftFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Close shift failed:', error);
  }
}

function* getCurrentShift() {
  try {
    const params = {
      api: `${config.ip}/shifts/current`,
      method: 'GET',
      successAction: fetchCurrentShiftSuccess(),
      failAction: fetchCurrentShiftFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch current shift failed:', error);
  }
}

function* getShiftSummary(action) {
  try {
    const { shiftId } = action.payload;
    const params = {
      api: `${config.ip}/shifts/summary?shiftId=${shiftId}`,
      method: 'GET',
      successAction: fetchShiftSummarySuccess(),
      failAction: fetchShiftSummaryFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch shift summary failed:', error);
  }
}

export default function* ShiftActionWatcher() {
  yield takeEvery(openShift.type, postOpenShift);
  yield takeEvery(closeShift.type, postCloseShift);
  yield takeEvery(fetchCurrentShift.type, getCurrentShift);
  yield takeEvery(fetchShiftSummary.type, getShiftSummary);
}

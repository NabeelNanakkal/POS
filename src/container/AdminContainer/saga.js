import commonApi from 'container/api';
import config from 'config';
import { call, takeEvery, put } from 'redux-saga/effects';
import {
  createTelecallerSuccess,
  createTelecallerFail,
  createLeadSuccess,
  createLeadFail,
  getTelecallersSuccess,
  getTelecallersFail,
  updateTelecallerSuccess,
  updateTelecallerFail,
  deleteTelecallerSuccess,
  deleteTelecallerFail,
  getTelecallers,
  importLeadsSuccess,
  importLeadsFail
} from './slice';
import { toast } from 'react-toastify';

function* createTelecallerFn(action) {
  try {
    const body = action.payload?.body || action.payload;

    const apiParams = {
      api: `${config.ip}/data?index=users`,
      method: 'POST',
      successAction: createTelecallerSuccess(),
      failAction: createTelecallerFail(),
      body: JSON.stringify(body),
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    return res;
  } catch (error) {
    yield put(createTelecallerFail(error));
  }
}

function* createLeadFn(action) {
  try {
    const body = action.payload?.body || action.payload;

    // attach tenantId if not provided
    if (!body.tenantId) {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        if (user?.tenantId) body.tenantId = user.tenantId;
      } catch (e) {
        // ignore
      }
    }

    const apiParams = {
      api: `${config.ip}/data?index=leads`,
      method: 'POST',
      successAction: createLeadSuccess(),
      failAction: createLeadFail(),
      body: JSON.stringify(body),
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    return res;
  } catch (error) {
    yield put(createLeadFail(error));
  }
}

function* getTelecallersFn(action) {
  try {
    const params = action.payload?.params || {};

    const apiParams = {
      api: `${config.ip}/data?index=users`,
      method: 'GET',
      successAction: getTelecallersSuccess(),
      failAction: getTelecallersFail(),
      params,
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    return res;
  } catch (error) {
    yield put(getTelecallersFail(error));
  }
}

function* updateTelecallerFn(action) {
  try {
    const id = action.payload?.id || action.payload;
    const body = action.payload?.body || {};

    const apiParams = {
      api: `${config.ip}/data/${id}?index=users`,
      method: 'PUT',
      successAction: updateTelecallerSuccess(),
      failAction: updateTelecallerFail(),
      body: JSON.stringify(body),
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    if (res) {
      toast.success('Telecaller updated successfully', { autoClose: 2000 });
      yield put(getTelecallers());
    }
    return res;
  } catch (error) {
    yield put(updateTelecallerFail(error));
  }
}

function* deleteTelecallerFn(action) {
  try {
    const id = action.payload?.id || action.payload;

    const apiParams = {
      api: `${config.ip}/data/${id}?index=users`,
      method: 'DELETE',
      successAction: deleteTelecallerSuccess(),
      failAction: deleteTelecallerFail(),
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    if (res) {
      toast.success('Telecaller deleted successfully', { autoClose: 2000 });
      yield put(getTelecallers());
    }
    return res;
  } catch (error) {
    yield put(deleteTelecallerFail(error));
  }
}

function* importLeadsFn(action) {
  try {
    const file = action.payload;
    const formData = new FormData();
    formData.append('file', file);

    const apiParams = {
      api: `${config.ip}/lead/bulk-dump`,
      method: 'POST',
      successAction: importLeadsSuccess(),
      failAction: importLeadsFail(),
      body: formData,
      authourization: 'token'
    };

    const res = yield call(commonApi, apiParams);
    return res;
  } catch (error) {
    yield put(importLeadsFail(error));
  }
}

export default function* AdminActionWatcher() {
  console.log('Setting up Admin Saga Watchers');
  yield takeEvery('admin/createTelecaller', createTelecallerFn);
  yield takeEvery('admin/createLead', createLeadFn);
  yield takeEvery('admin/getTelecallers', getTelecallersFn);
  yield takeEvery('admin/updateTelecaller', updateTelecallerFn);
  yield takeEvery('admin/deleteTelecaller', deleteTelecallerFn);
  yield takeEvery('admin/importLeads', importLeadsFn);
}

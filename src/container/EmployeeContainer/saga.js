import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../api';
import config from '../../config';
import {
  fetchEmployees, fetchEmployeesSuccess, fetchEmployeesFail,
  bulkCreateEmployees, bulkCreateEmployeesSuccess, bulkCreateEmployeesFail,
  createEmployee, createEmployeeSuccess, createEmployeeFail,
  updateEmployee, updateEmployeeSuccess, updateEmployeeFail,
  deleteEmployee, deleteEmployeeSuccess, deleteEmployeeFail,
  resetPassword, resetPasswordSuccess, resetPasswordFail,
  fetchStats, fetchStatsSuccess, fetchStatsFail
} from './slice';

function* getEmployees(action) {
  try {
    const store = action.payload;
    const api = store && store !== 'All' ? `${config.ip}/employees?store=${store}` : `${config.ip}/employees`;
    const params = {
      api,
      method: 'GET',
      successAction: fetchEmployeesSuccess(),
      failAction: fetchEmployeesFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch employees failed:', error);
  }
}

function* bulkPostEmployees(action) {
  try {
    const params = {
      api: `${config.ip}/employees/bulk`,
      method: 'POST',
      successAction: bulkCreateEmployeesSuccess(),
      failAction: bulkCreateEmployeesFail(),
      body: JSON.stringify({ employees: action.payload }),
      authourization: 'Bearer'
    };
    const response = yield call(commonApi, params);
    if (response) {
      toast.success(response.message || 'Employees imported successfully');
      yield put(fetchEmployees());
      yield put(fetchStats());
    }
  } catch (error) {
    toast.error(error.message || 'Bulk create employees failed');
    console.error('Bulk create employees failed:', error);
  }
}

function* postEmployee(action) {
  try {
    const params = {
      api: `${config.ip}/employees`,
      method: 'POST',
      successAction: createEmployeeSuccess(),
      failAction: createEmployeeFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    const response = yield call(commonApi, params);
    if (response) {
      toast.success(response.message || 'Employee hired successfully');
      yield put(fetchEmployees());
      yield put(fetchStats());
    }
  } catch (error) {
    toast.error(error.message || 'Create employee failed');
    console.error('Create employee failed:', error);
  }
}

function* putEmployee(action) {
  try {
    const { id, ...data } = action.payload;
    const params = {
      api: `${config.ip}/employees/${id}`,
      method: 'PUT',
      successAction: updateEmployeeSuccess(),
      failAction: updateEmployeeFail(),
      body: JSON.stringify(data),
      authourization: 'Bearer'
    };
    const response = yield call(commonApi, params);
    if (response) {
      toast.success(response.message || 'Employee updated successfully');
      yield put(fetchEmployees());
      yield put(fetchStats());
    }
  } catch (error) {
    toast.error(error.message || 'Update employee failed');
    console.error('Update employee failed:', error);
  }
}

function* removeEmployee(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/employees/${id}`,
      method: 'DELETE',
      successAction: deleteEmployeeSuccess({ id }),
      failAction: deleteEmployeeFail(),
      authourization: 'Bearer'
    };
    const response = yield call(commonApi, params);
    if (response) {
      toast.success(response.message || 'Employee deleted successfully');
      yield put(fetchEmployees());
      yield put(fetchStats());
    }
  } catch (error) {
    toast.error(error.message || 'Delete employee failed');
    console.error('Delete employee failed:', error);
  }
}

function* resetPasswordSaga(action) {
  try {
    const { id, password } = action.payload;
    const params = {
      api: `${config.ip}/employees/action/reset-password/${id}`,
      method: 'PUT',
      successAction: resetPasswordSuccess(),
      failAction: resetPasswordFail(),
      body: JSON.stringify({ password }),
      authourization: 'Bearer'
    };
    const response = yield call(commonApi, params);
    if (response) {
      toast.success(response.message || 'Password reset successfully');
    }
  } catch (error) {
    toast.error(error.message || 'Password reset failed');
    console.error('Password reset failed:', error);
  }
}

function* fetchStatsSaga(action) {
  try {
    const store = action.payload;
    const api = store && store !== 'All' ? `${config.ip}/dashboard/employee-stats?store=${store}` : `${config.ip}/dashboard/employee-stats`;
    const params = {
      api,
      method: 'GET',
      successAction: fetchStatsSuccess(),
      failAction: fetchStatsFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch stats failed:', error);
  }
}

export default function* EmployeeActionWatcher() {
  yield takeEvery(fetchEmployees.type, getEmployees);
  yield takeEvery(bulkCreateEmployees.type, bulkPostEmployees);
  yield takeEvery(createEmployee.type, postEmployee);
  yield takeEvery(updateEmployee.type, putEmployee);
  yield takeEvery(deleteEmployee.type, removeEmployee);
  yield takeEvery(resetPassword.type, resetPasswordSaga);
  yield takeEvery(fetchStats.type, fetchStatsSaga);
}

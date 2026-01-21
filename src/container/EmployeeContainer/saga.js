import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchEmployees, fetchEmployeesSuccess, fetchEmployeesFail,
  createEmployee, createEmployeeSuccess, createEmployeeFail,
  updateEmployee, updateEmployeeSuccess, updateEmployeeFail,
  deleteEmployee, deleteEmployeeSuccess, deleteEmployeeFail
} from './slice';

function* getEmployees() {
  try {
    const params = {
      api: `${config.ip}/employees`,
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
    yield call(commonApi, params);
  } catch (error) {
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
    yield call(commonApi, params);
  } catch (error) {
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
    yield call(commonApi, params);
  } catch (error) {
    console.error('Delete employee failed:', error);
  }
}

export default function* EmployeeActionWatcher() {
  yield takeEvery(fetchEmployees.type, getEmployees);
  yield takeEvery(createEmployee.type, postEmployee);
  yield takeEvery(updateEmployee.type, putEmployee);
  yield takeEvery(deleteEmployee.type, removeEmployee);
}

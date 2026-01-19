import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFail,
  createCategory, createCategorySuccess, createCategoryFail
} from './slice';

function* getCategories() {
  try {
    const params = {
      api: `${config.ip}/categories`,
      method: 'GET',
      successAction: fetchCategoriesSuccess(),
      failAction: fetchCategoriesFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch categories failed:', error);
  }
}

function* addCategory(action) {
  try {
    const params = {
      api: `${config.ip}/categories`,
      method: 'POST',
      successAction: createCategorySuccess(),
      failAction: createCategoryFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create category failed:', error);
  }
}

export default function* CategoryActionWatcher() {
  yield takeEvery(fetchCategories.type, getCategories);
  yield takeEvery(createCategory.type, addCategory);
}

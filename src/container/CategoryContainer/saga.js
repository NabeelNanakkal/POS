import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFail,
  createCategory, createCategorySuccess, createCategoryFail,
  updateCategory, updateCategorySuccess, updateCategoryFail,
  deleteCategory, deleteCategorySuccess, deleteCategoryFail
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

function* editCategory(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/categories/${id}`,
      method: 'PUT',
      successAction: updateCategorySuccess(),
      failAction: updateCategoryFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Update category failed:', error);
  }
}

function* removeCategory(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.ip}/categories/${id}`,
      method: 'DELETE',
      successAction: deleteCategorySuccess(action.payload),
      failAction: deleteCategoryFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Delete category failed:', error);
  }
}

export default function* CategoryActionWatcher() {
  yield takeEvery(fetchCategories.type, getCategories);
  yield takeEvery(createCategory.type, addCategory);
  yield takeEvery(updateCategory.type, editCategory);
  yield takeEvery(deleteCategory.type, removeCategory);
}

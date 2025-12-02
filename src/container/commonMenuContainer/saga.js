import { call, delay, put, select, takeEvery } from 'redux-saga/effects';
import config from 'config';
import commonApi from 'container/api';
import {
  getCommonMenuDataFail,
  getCommonMenuDataSuccess,
  updateDocbyIdSuccess,
  updateDocbyIdFail,
  getContactsByIDSuccess,
  getContactsByIDFail,
  getCommonMenuData,
  getDataByIDSuccess,
  getDataByIDFail,
  getRedirectedMenuDataSuccess,
  getRedirectedMenuDataFail,
  getTotalDataSuccess,
  getTotalDataFail,
  getDataByFilterFail,
  getDataByFilterSuccess,
  getRedirectDataByIDSuccess,
  getRedirectDataByIDFail,
  uploadFileFail,
  uploadFileSuccess,
  getDataByID,
  addCommonMenuDataFnSuccess,
  addCommonMenuDataFnFail,
  getFileSuccess,
  getFileFail,
  deleteFileSuccess,
  deleteFileFail,
  getFile,
  updateCommonMenuDataSuccess,
  updateCommonMenuDataFail
} from './slice';

function* updateCommonMenuDataFn(action) {
  const { endPoint, baseFilter, id, apiType, defaultSort } = action?.payload;

  const data = action.payload.data;
  try {
    const apiUrl = `${config.ip}${endPoint}/${id}`;
    const apiParams = {
      api: apiUrl,
      method: 'PUT',
      successAction: updateCommonMenuDataSuccess(),
      failAction: updateCommonMenuDataFail(),
      authourization: 'token',
      body: JSON.stringify(data)
    };
    yield call(commonApi, apiParams);
    yield put(getCommonMenuData({ endPoint, apiType, params: { size: 20, baseFilter: baseFilter, ...defaultSort } }));
  } catch (error) {
    console.error('Data Update Error:', error);
  }
}

// function* addCommonMenuData(action) {
//   const { endPoint, baseFilter, apiType } = action?.payload;
//   console.log(action?.payload)

//   const data = action.payload.data;
//   try {
//     const apiUrl = `${config.ip}${endPoint}}`;
//     const apiParams = {
//       api: apiUrl,
//       method: 'POST',
//       successAction: addCommonMenuDataFnSuccess(),
//       failAction: addCommonMenuDataFnFail(),
//       authourization: 'token',
//       body: JSON.stringify(data)
//     };
//     // yield call(commonApi, apiParams);
//     // yield put(getCommonMenuData({ endPoint, apiType, params: { size: 20, baseFilter: baseFilter } }));
//   } catch (error) {
//     console.error('Data Update Error:', error);
//   }
// }

function* addCommonMenuData(action) {
  const { endPoint, role, baseFilter, apiType, apiEndPoint, organizationType, defaultSort } = action?.payload;
  const data = action.payload.data;

  try {
    const apiUrl = `${config.ip}${endPoint}`;

    const formData = new FormData();

    // Basic fields
    formData.append('email', data.contactEmail || '');
    formData.append('role', role || '');
    formData.append('password', 'abc@123');

    // Build profile object (without contactEmail)
    const profileData = { ...data };
    delete profileData.contactEmail;

    // ✅ Add organizationType inside profile if it exists
    if (organizationType) {
      profileData.organizationType = organizationType;
    }

    // Append profile JSON
    formData.append('profile', JSON.stringify(profileData));

    const apiParams = {
      api: apiUrl,
      method: 'POST',
      successAction: addCommonMenuDataFnSuccess(),
      failAction: addCommonMenuDataFnFail(),
      authourization: 'token',
      body: formData,
      headers: {
        Accept: 'application/json'
        // Do NOT set Content-Type manually; FormData handles it
      }
    };

    yield call(commonApi, apiParams);

    // Refresh common menu
    yield put(getCommonMenuData({ endPoint: apiEndPoint, apiType, params: { size: 20, baseFilter, ...defaultSort } }));
  } catch (error) {
    console.error('Data Update Error:', error);
  }
}

function* getCommonMenuDataFn(action) {
  try {
    const { endPoint, apiType, params } = action.payload;
    console.log(params);
    const query = {
      limit: params?.size || 20
    };

    if (params?.searchAfter && params.searchAfter.length > 0) {
      query.searchAfter = JSON.stringify(params.searchAfter);
    } else {
      if (params?.fethcedDataCount && params.fethcedDataCount > 0) {
        if (apiType === 'frappe') {
          query.searchAfter = params?.fethcedDataCount;
        }
      }
    }

    if (params?.searchField && params?.searchTerm) {
      // query.filters = {
      //   ...query.filters,
      //   [params.searchField]: params.searchTerm
      // };
      query.search = params.searchTerm;
      query.searchFields = params.searchField;
      if (apiType === 'frappe') {
        query.filters = [[`${params.searchField}`, 'like', `%${params.searchTerm}%`]];
      }
      if (apiType === 'foallocation' || apiType === 'foallocationToday') {
        query.search = params.searchTerm;
      }
    }

    if (endPoint !== '/users' && endPoint !== '/user-daily-logs' && apiType !== 'foallocation') {
      // query.sortBy = "updatedOn"
      query.sortOrder = 'desc';
      if (apiType === 'frappe') {
        query.sortBy = 'modified';
        query.sortOrder = 'desc';
      }
    }

    if (params?.sortField && params?.sortOrder) {
      query.sortBy = params?.sortField;
      query.sortOrder = params?.sortOrder;
      if (apiType === 'foallocation') {
        query.sortOrder = params?.sortOrder;
      }
    }

    if (params?.filters && params.filters.filter((filter) => filter.field && filter.value).length > 0) {
      if (apiType === 'frappe') {
        // frappe still needs array format
        query.filters = params.filters.flatMap((filter) => {
          if (filter.fieldType == 'date') {
            if (filter.value.gte == filter.value.lte) {
              return [[filter.field, '=', filter.value.gte]];
            } else
              return [
                [filter.field, '>=', filter.value.gte],
                [filter.field, '<=', filter.value.lte]
              ];
          } else {
            return [[filter.field, '=', filter.value]];
          }
        });
        query.exact = true;
      } else {
        // instead of wrapping inside filters object → spread them as query params
        params.filters.forEach((filter) => {
          query[filter.field] = filter.value;
        });
      }
    }

    console.log(query.filters)

    // if (params?.baseFilter) {  // old filteration
    //         query.exact = true
    //         query.filters = {
    //             ...query.filters,
    //             ...params.baseFilter,
    //         };
    //     }

    if (params?.baseFilter) {
      //new filteration
      query.exact = true;

      if (apiType === 'foallocation' || apiType === 'foallocationToday') {
        // spread baseFilter directly into query for foallocation APIs
        Object.assign(query, params.baseFilter);
      } else {
        query.filters = {
          ...query.filters,
          ...params.baseFilter
        };
      }
    }

    if (endPoint == '/user_daily_logs') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role == 'State Head') {
        // if (user?.role !== "Admin" && user?.role !== "Management") {
        query.exact = true;
        query.filters = {
          ...query.filters,
          ...{
            stateHead: user?.id
          }
        };
      }
    }

    console.log(query.filters)
    if (query.filters) {
      query.filters = JSON.stringify(query.filters);
    }

    const queryString = new URLSearchParams(query).toString();

    let apiUrl = `${config.ip}${endPoint}?${queryString}`;
    //  apiUrl = `${config.ip}/foallocation/count?index=parties`;

    if (apiType === 'frappe') {
      const cleanedEndPoint = endPoint.replace(/^\/+/, '');
      apiUrl = `${config.ip}/proxy/resource?collection=${cleanedEndPoint}&${queryString}`;
    }
    if (apiType === 'foallocation') {
      apiUrl = `${config.ip}${endPoint}?${queryString}`;
    }
    if (apiType === 'foallocationToday') {
      apiUrl = `${config.ip}${endPoint}?${queryString}&today=true`;
    }
    if (apiType === 'direct') {
      apiUrl = `${config.ip}${endPoint}?${queryString}`;
    }

    if (query.filters && !(apiType === 'foallocation' || apiType === 'foallocationToday')) {
      query.filters = JSON.stringify(query.filters);
    } /// new filteratoin conditoin

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getCommonMenuDataSuccess(),
      failAction: getCommonMenuDataFail(),
      authourization: 'token',
      metaPayLoad: action.payload
    };

    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in getCommonMenuDataFn:', error);
  }
}

function* getTotalDataFn(action) {
  try {
    const { endPoint, apiType, params } = action.payload;
    const query = {
      size: params?.size || 20
    };

    if (params?.searchAfter && params.searchAfter.length > 0) {
      query.searchAfter = JSON.stringify(params.searchAfter);
    } else {
      if (params?.fethcedDataCount && params.fethcedDataCount > 0) {
        if (apiType === 'frappe') {
          query.searchAfter = params?.fethcedDataCount;
        }
      }
    }

    if (params?.searchField && params?.searchTerm) {
      query.filters = {
        ...query.filters,
        [params.searchField]: params.searchTerm
      };
      if (apiType === 'frappe') {
        query.filters = [[`${params.searchField}`, 'like', `%${params.searchTerm}%`]];
      }
      if (apiType === 'foallocation' || apiType === 'foallocationToday') {
        query.search = params.searchTerm;
      }
    }

    if (params?.sortField && params?.sortOrder) {
      query.sortBy = params?.sortField;
      query.sortOrder = params?.sortOrder;
      if (apiType === 'foallocation') {
        query.sortOrder = params?.sortOrder;
      }
    }

    if (params?.filters && params.filters.filter((filter) => filter.field && filter.value).length > 0) {
      let transformedFilters;

      if (apiType === 'frappe') {
        transformedFilters = params.filters.map((filter) => [filter.field, '=', filter.value]);
      } else {
        transformedFilters = params.filters.reduce((acc, filter) => {
          acc[filter.field] = filter.value;
          return acc;
        }, {});
      }

      if (apiType === 'frappe') {
        query.filters = transformedFilters;
      } else {
        query.filters = {
          ...query.filters,
          ...transformedFilters
        };
      }

      query.exact = true;
    }

    if (params?.baseFilter) {
      query.exact = true;
      query.filters = {
        ...query.filters,
        ...params.baseFilter
      };
    }

    if (query.filters) {
      query.filters = JSON.stringify(query.filters);
    }

    const queryString = new URLSearchParams(query).toString();

    let apiUrl = `${config.ip}/index${endPoint}?${queryString}`;
    //  apiUrl = `${config.ip}/foallocation/count?index=parties`;

    if (apiType === 'frappe') {
      const cleanedEndPoint = endPoint.replace(/^\/+/, '');
      apiUrl = `${config.ip}/proxy/resource?collection=${cleanedEndPoint}&${queryString}`;
    }
    if (apiType === 'foallocation') {
      apiUrl = `${config.ip}${endPoint}?${queryString}`;
    }

    if (apiType === 'foallocationToday') {
      apiUrl = `${config.ip}${endPoint}?${queryString}&today=true`;
    }

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getTotalDataSuccess(),
      failAction: getTotalDataFail(),
      authourization: 'token'
    };

    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in getCommonMenuDataFn:', error);
  }
}

function* getRedirectedMenuDataFn(action) {
  try {
    const { index, id } = action.payload;
    const apiUrl = `${config.ip}/get-by-id?index=${index}&id=${id}`;

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getRedirectedMenuDataSuccess(),
      failAction: getRedirectedMenuDataFail(),
      authourization: 'token'
    };

    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in get By ID Saga:', error);
  }
}

function* getDataByIDFn(action) {
  try {
    const { endpoints, id } = action.payload;
    const apiUrl = `${config.ip}/${endpoints}/${id}`;

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getDataByIDSuccess(),
      failAction: getDataByIDFail(),
      authourization: 'token'
    };
    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in get By ID Saga:', error);
  }
}
function* getRedirectDataByIDFn(action) {
  try {
    const { index, id } = action.payload;
    const apiUrl = `${config.ip}/get-by-id?index=${index}&id=${id}`;

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getRedirectDataByIDSuccess(),
      failAction: getRedirectDataByIDFail(),
      authourization: 'token'
    };
    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in get By ID Saga:', error);
  }
}

function* getDataByFilterFn(action) {
  // all: true,
  try {
    const docName = action?.payload?.docName;
    const isNonIndexEndPoint = action?.payload?.isNonIndexEndPoint;
    const query = {
      exact: true,
      size: action?.payload?.size || 9999,
      filters: JSON.stringify(action.payload.fliterData)
    };
    if (action.payload?.sortField && action.payload?.sortOrder) {
      (query.sortBy = action.payload?.sortField), (query.sortOrder = action.payload?.sortOrder);
    }

    const queryString = new URLSearchParams(query).toString();
    // let apiUrl = `${config.ip}/index${docName}?${queryString}`;
    let apiUrl = isNonIndexEndPoint ? `${config.ip}${docName}?${queryString}` : `${config.ip}/index${docName}?${queryString}`;

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getDataByFilterSuccess(),
      failAction: getDataByFilterFail(),
      authourization: 'token'
    };
    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in get By ID Saga:', error);
  }
}




function* getContactsByIDFn(action) {
  try {
    const query = {
      filters: action.payload,
      size: 50,
      exact: true
    };
    query.filters = JSON.stringify(query.filters);
    const queryString = new URLSearchParams(query).toString();

    const apiUrl = `${config.ip}/index/party_contacts?${queryString}`;

    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getContactsByIDSuccess(),
      failAction: getContactsByIDFail(),
      authourization: 'token'
    };
    yield call(commonApi, apiParams);
  } catch (error) {
    console.error('Error in getCommonMenuDataFn:', error);
  }
}












function* updateDocbyIdFn(action) {
  try {
    const { docName, id, data, isNoReload, isNoItemRefetch, baseFilter } = action.payload;
    let payLoad = data;
    const apiUrl = `${config.ip}/${docName}/${id}`;
    const apiParams = {
      api: apiUrl,
      method: 'PUT',
      successAction: updateDocbyIdSuccess(),
      failAction: updateDocbyIdFail(),
      authourization: 'token',
      body: JSON.stringify(payLoad)
    };
    const res = yield call(commonApi, apiParams);
    if (res && !isNoReload) {
      let params = {};
      if (baseFilter) {
        params.baseFilter = baseFilter;
      }
      yield put(
        getCommonMenuData({
          endPoint: `/${docName}`,
          // apiType: menuConfig.apiType,
          params: params
        })
      );
    }
    if (res && !isNoItemRefetch) {
      let params = {};
      if (baseFilter) {
        params.baseFilter = baseFilter;
      }
      yield put(
        getDataByID({
          index: docName,
          id: id
        })
      );
    }
  } catch (error) {
    yield put(updateDocbyIdFail());
    console.error('Error in updateDocbyId:', error);
  }
}
function* getFilesFn(action) {
  try {
    const { relatedId } = action.payload;
    // const formData = new FormData();
    // formData.append('attachment', file);
    // formData.append('relatedType', relatedType);
    // formData.append('relatedId', relatedId);
    // const apiUrl = `${config.ip}/documents`;
    const apiUrl = `http://167.71.231.114:1337/documents?relatedId=${relatedId}&limit=1000`;
    const apiParams = {
      api: apiUrl,
      method: 'GET',
      successAction: getFileSuccess,
      failAction: getFileFail,
      authourization: 'token'
    };
    const res = yield call(commonApi, apiParams);
  } catch (error) {
    yield put(getFileFail(error.response?.data || error.message));
    console.error('Error in uploadFile:', error);
  }
}

function* uploadFileFn(action) {
  try {
    const { file, relatedType, relatedId, name } = action.payload;
    const formData = new FormData();
    formData.append('attachment', file);
    formData.append('relatedType', relatedType);
    formData.append('relatedId', relatedId);
    formData.append('name', name);
    // const apiUrl = `${config.ip}/documents`;
    const apiUrl = `http://167.71.231.114:1337/documents`;
    const apiParams = {
      api: apiUrl,
      method: 'POST',
      successAction: uploadFileSuccess,
      failAction: uploadFileFail,
      authourization: 'token',
      body: formData
    };
    const res = yield call(commonApi, apiParams);
    if (res?.success) {
      yield put(getFile({ relatedId })); // <-- dispatch the action, not call generator
    }
  } catch (error) {
    yield put(uploadFileFail(error.response?.data || error.message));
    console.error('Error in uploadFile:', error);
  }
}

function* deleteFileFn(action) {
  try {
    const { relatedId,objectId } = action.payload;
    const apiUrl = `http://167.71.231.114:1337/documents/${objectId}`;
    const apiParams = {
      api: apiUrl,
      method: 'DELETE',
      successAction: deleteFileSuccess(),
      failAction: deleteFileFail(),
      authourization: 'token'
    };
    const res = yield call(commonApi, apiParams);
     if (res?.success) {
      yield put(getFile({ relatedId })); 
    }
  } catch (error) {
    yield put(getFileFail(error.response?.data || error.message));
    console.error('Error in deleteFile:', error);
  }
}


export default function* commonMenuActionWacther() {
  yield takeEvery('commonMenu/updateCommonMenuData', updateCommonMenuDataFn);
  yield takeEvery('commonMenu/getCommonMenuData', getCommonMenuDataFn);
  yield takeEvery('commonMenu/getRedirectedMenuData', getRedirectedMenuDataFn);
  yield takeEvery('commonMenu/getTotalData', getTotalDataFn);
  yield takeEvery('commonMenu/getDataByID', getDataByIDFn);
  yield takeEvery('commonMenu/getRedirectDataByID', getRedirectDataByIDFn);
  yield takeEvery('commonMenu/getDataByFilter', getDataByFilterFn);
  yield takeEvery('commonMenu/getContactsByID', getContactsByIDFn);
  yield takeEvery('commonMenu/updateDocbyId', updateDocbyIdFn);
  yield takeEvery('commonMenu/uploadFile', uploadFileFn);
  yield takeEvery('commonMenu/addCommonMenuDataFn', addCommonMenuData);
  yield takeEvery('commonMenu/getFile', getFilesFn);
  yield takeEvery('commonMenu/deleteFile', deleteFileFn);
}

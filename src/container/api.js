import { delay, put } from 'redux-saga/effects';
import { Base64 } from 'js-base64';
import { toast } from 'react-toastify';
import { userLogOut } from './LoginContainer/slice';

function* commonApi(value) {

  const token = yield localStorage.getItem(import.meta.env.VITE_APP_SESSION_TOKEN);

  let authorization = value.authourization
    ? value.authourization === 'Basic'
      ? 'Basic ' + Base64.btoa(value.body.email + ':' + value.body.password)
      : `Bearer ${token}`
    : `Bearer ${token}`;


  const isFormData = value.body instanceof FormData;
  const authHeader = {
    Accept: 'application/json',
    ...(!isFormData && { 'Content-Type': 'application/json', }),
    Authorization: authorization,
    // key: value.key
    // Origin: 'http://localhost:3000'
  };
  const noauthHeader = {
    Accept: 'application/json',
    ...(!isFormData && { 'Content-Type': 'application/json', }),
    // key: value.key
  };

  try {
    const response = yield fetch(`${value.api}`, {
      method: `${value.method}`,
      headers: value.authourization !== null ? authHeader : noauthHeader,
      body: value.body ? value.body : null
    });

    if (!response.ok) {
      if (response.status === 405) {
        const currentUrl = window.location.href;
        localStorage.setItem("redirectAfterLogin", currentUrl);
        toast.warn('Session expired! Logging out...', { autoClose: 1200 });
        yield delay(1500);
        yield put(userLogOut());
        return
      }

      let errorMessage
      try {
        const errorJSON = yield response.json();
        errorMessage = errorJSON?.frappe?.message?.message || errorJSON.message || errorJSON.error;
      } catch (e) {
        console.error("Error parsing response JSON:", e);
      }

      throw new Error(errorMessage);
    } else {
      if (response.status === 204) {
        yield put({
          type: `${value.successAction.type}`,
          payload: { metaPayLoad: value?.metaPayLoad, ...value.payload }
        });
        return { status: response.status, payload: '' };
      } else {
        const resJSON = yield response.json();

        yield put({
          type: `${value.successAction.type}`,
          // payload: resJSON
          payload: { metaPayLoad: value?.metaPayLoad, ...resJSON }

        });
        return resJSON;
      }
    }
  } catch (error) {
    yield put({
      type: `${value.failAction.type}`,
      payload: error.message || 'An unexpected error occurred'
    });
    throw error
  }
}

export default commonApi;
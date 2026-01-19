import commonApi from '../api';
import config from '../../config';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess, loginFail } from './slice';
import { takeEvery, call, put } from 'redux-saga/effects';
import { roleBasedRedirects } from 'constants/roleBasedRedirects';

function* login(action) {
  try {
    const data = {
      email: action.payload.email,
      password: action.payload.password,
    };
    const datas = JSON.stringify(data);
    let params = {
      api: `${config.ip}/auth/login`,
      method: 'POST',
      successAction: loginSuccess(),
      failAction: loginFail(),
      body: datas,
      authourization: 'None' // commonApi handles null/None as no-auth
    };

    let res = yield call(commonApi, params);
    if (res) {
      yield localStorage.setItem('token', res.token);
      yield localStorage.setItem('user', JSON.stringify(res.user));

      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      const userRole = res.user?.role;
      // clg('User Role:', userRole);
      if (redirectUrl && redirectUrl.startsWith(window.location.origin)) {
        yield localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
  const targetUrl = roleBasedRedirects[userRole] || '/main/admin';
  // After login we must reload the app so routes/menu (which are generated
  // at module-load time using localStorage) are rebuilt with the new user
  // role. Navigate without reload can land on a missing route until the
  // router is re-created, so do a hard replace here.
  yield call(() => window.location.replace(targetUrl));
      }
    } else {
      yield put(loginFail({ error: 'No response from server' }));
      // yield call(action.payload.navigate, '/login', { replace: true });
    }
  } catch (error) {
    yield put(loginFail({ error: 'No response from server' }));
    console.error('Login failed:', error);
    // yield put(loginFail({ error: error.message || 'An unexpected error occurred' }));
    yield call(action.payload.navigate, '/login', { replace: true });
  }
}

function* logOut() {
  try {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('user');
    // clear any stored redirectAfterLogin to avoid redirecting next user to previous user's page
    yield localStorage.removeItem('redirectAfterLogin');
    window.location.replace('/login');
  } catch (error) {
    console.error(error);
  }
}

export default function* LoginActionWatcher() {
  yield takeEvery('login/userLogin', login);
  yield takeEvery('login/userLogOut', logOut);
  // yield takeEvery('login/getLoginUser', getLoginUserDetail);
}

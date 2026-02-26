import authService from '../../services/auth.service';
import { tokenManager } from '../../utils/tokenManager';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess, loginFail } from './slice';
import { setPermissions, clearPermissions } from '../permission/slice';
import { takeEvery, call, put } from 'redux-saga/effects';
import { getRoleBasedRedirect } from 'constants/roleBasedRedirects';

function* login(action) {
  try {
    const { email, password } = action.payload;

    // Call the new backend API
    const response = yield call(authService.login, email, password);

    if (response && response.data) {
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens using token manager
      yield call(tokenManager.setTokens, accessToken, refreshToken);

      // Store user data
      yield localStorage.setItem('user', JSON.stringify(user));

      // Store permissions for synchronous access (AuthGuard, filterMenuByRole)
      const permissions = user.permissions ?? null;
      yield localStorage.setItem('permissions', JSON.stringify(permissions));

      // Dispatch success action
      yield put(loginSuccess({ user, accessToken, refreshToken }));
      yield put(setPermissions(permissions));

      // Handle redirect
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      const userRole = user?.role;
      const storeCode = user?.store?.code || 'store';

      if (redirectUrl && redirectUrl.startsWith(window.location.origin)) {
        yield localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        const targetUrl = getRoleBasedRedirect(userRole, storeCode);
        // Hard reload to rebuild routes/menu with new user role
        yield call(() => window.location.replace(targetUrl));
      }
    } else {
      yield put(loginFail({ message: 'No response from server' }));
    }
  } catch (error) {
    console.error('Login failed:', error);
    yield put(loginFail({ message: error.message || 'Login failed' }));
  }
}

function* logOut() {
  try {
    const refreshToken = yield call(tokenManager.getRefreshToken);

    // Call logout API to invalidate refresh token
    if (refreshToken) {
      try {
        yield call(authService.logout, refreshToken);
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local cleanup even if API call fails
      }
    }

    // Clear tokens and user data
    yield call(tokenManager.clearTokens);
    yield localStorage.removeItem('user');
    yield localStorage.removeItem('permissions');
    yield localStorage.removeItem('redirectAfterLogin');
    yield put(clearPermissions());

    // Redirect to login
    window.location.replace('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Force cleanup and redirect even on error
    tokenManager.clearTokens();
    localStorage.clear();
    window.location.replace('/login');
  }
}

export default function* LoginActionWatcher() {
  yield takeEvery('login/userLogin', login);
  yield takeEvery('login/userLogOut', logOut);
}

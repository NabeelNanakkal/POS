import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
  },
  reducers: {
    userLogin: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      toast.success('Login successful', {
        autoClose: 3000
      });
    },
    loginFail: (state, action) => {
      toast.error(action?.payload?.message || 'Login failed', {
        autoClose: 3000
      });
      state.loading = false;
      state.error = action.payload;
    },

    userLogOut: (state) => {
      toast.warn("Logging out...");
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },

    // Update tokens after refresh
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    getLoginUser: (state) => {
      state.loading = true;
      state.error = null;
    },
    getLoginUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    },
    getLoginUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  userLogin, 
  loginSuccess, 
  loginFail, 
  userLogOut, 
  updateTokens,
  getLoginUser, 
  getLoginUserSuccess, 
  getLoginUserFail 
} = loginSlice.actions;

export const selectError = (state) => state.login.error;
export const selectUser = (state) => state.login.user;
export const selectAccessToken = (state) => state.login.accessToken;

export default loginSlice.reducer;

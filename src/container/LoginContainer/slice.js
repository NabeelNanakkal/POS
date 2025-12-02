import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    data: {},
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
      toast.success('Login successfully', {
        autoClose: 3000
      });
      state.data = action.payload;
    },
    loginFail: (state, action) => {
      toast.error(action?.payload?.message ,{
        autoClose: 3000
      });
      state.loading = false;
      state.error = action.payload;
    },

    userLogOut: () => {
      toast.warn("Logging Out...")
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

export const { userLogin, loginSuccess, loginFail, userLogOut, getLoginUser, getLoginUserSuccess, getLoginUserFail } = loginSlice.actions;
export const selectError = (state) => state.login.error;

export default loginSlice.reducer;

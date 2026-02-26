import { createSlice } from '@reduxjs/toolkit';

const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    // null = admin bypass (full access to everything)
    // object = flat permissions map per module
    permissions: null,
  },
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = null;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;

export const selectPermissions = (state) => state.permission.permissions;

export default permissionSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const UserSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        error: null,
        resetPasswordSuccess: false,
        createUserSuccess: false
    },
    reducers: {
        resetPassword: (state) => {
            state.loading = true
            state.error = null
            state.resetPasswordSuccess = false
        },
        resetPasswordSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.resetPasswordSuccess = true
            toast.success("User password updated successfully")
        },
        resetPasswordFail: (state) => {
            state.loading = false
            state.error = null
            toast.error("Failed reset user password")
        },

        createUser: (state) => {
            state.loading = true
            state.error = null
            state.createUserSuccess = false
        },
        createUserSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.createUserSuccess = true
            toast.success("Successfully Created User")
        },
        createUserFail: (state) => {
            state.loading = false
            state.error = null
            toast.error("Failed Create User ")
        },

        clearUserActionSuccess: (state) => {
            state.resetPasswordSuccess = false
            state.createUserSuccess = false
        }
    }
})

export const {
    resetPassword,
    resetPasswordSuccess,
    resetPasswordFail,

    createUser,
    createUserSuccess,
    createUserFail,


    clearUserActionSuccess
} = UserSlice.actions

export default UserSlice.reducer
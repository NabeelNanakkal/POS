import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        loading: false,
        error: null,
        cardCounts: null,
        activityCounts: null,
    },
    reducers: {
        getCardCounts: (state) => {
            state.loading = true
            state.error = null
        },
        getCardCountsSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.cardCounts = action.payload
        },
        getCardCountsFail: (state) => {
            state.loading = false
            state.error = null
            toast.error("Failed to fetch DashBoard Data")
        },
        getActivityCounts: (state) => {
            state.loading = true
            state.error = null
        },
        getActivityCountsSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.activityCounts = action.payload
        },
        getActivityCountsFail: (state) => {
            state.loading = false
            state.error = null
            toast.error("Failed to fetch DashBoard activity Data")
        },
    }
})

export const {
    getCardCounts,
    getCardCountsSuccess,
    getCardCountsFail,
    getActivityCounts,
    getActivityCountsSuccess,
    getActivityCountsFail,

} = dashboardSlice.actions

export default dashboardSlice.reducer
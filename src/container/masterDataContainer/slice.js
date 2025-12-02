import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const masterDataSlice = createSlice({
    name: 'masterData',
    initialState: {
        loading: false,
        error: null,
        regionalHeads: [],
        stateHeads: [],
        areaManagers: [],
        FOs: [],
        tcLeads: [],
        teleCallers: [],
        masterDatalist: [],
    },

    reducers: {
        getCommonData: (state) => {
            state.loading = true;
            state.error = null;
        },
        getCommonDataSuccess: (state, action) => {
            state.loading = false;
            state.masterDatalist = action.payload.data;
        },
        getCommonDataFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching filter data failed', {
                autoClose: 2000
            });
        },


        clearRegionalHeads: (state) => {
            state.regionalHeads = [];
        },
        getRegionalHeads: (state) => {
            state.loading = true;
            state.error = null;
        },
        getRegionalHeadsSuccess: (state, action) => {
            state.loading = false;
            state.regionalHeads = action.payload.data;

        },
        getRegionalHeadsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching Regional Heads failed', {
                autoClose: 2000
            });
        },

        clearStateHeads: (state) => {
            state.stateHeads = [];
        },
        getStateHeads: (state) => {
            state.loading = true;
            state.error = null;
        },
        getStateHeadsSuccess: (state, action) => {
            state.loading = false;
            state.stateHeads = action.payload.data;

        },
        getStateHeadsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching State Heads failed', {
                autoClose: 2000
            });
        },
        clearAreaManagers: (state) => {
            state.areaManagers = [];
        },
        getAreaManagers: (state) => {
            state.loading = true;
            state.error = null;
        },
        getAreaManagersSuccess: (state, action) => {
            state.loading = false;
            state.areaManagers = action.payload.data;
        },
        getAreaManagersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching Area Managers failed', {
                autoClose: 2000
            });
        },
        clearFOs: (state) => {
            state.FOs = [];
            state.error = null;
        },
        getFOs: (state) => {
            state.loading = true;
            state.error = null;
        },
        getFOsSuccess: (state, action) => {
            state.loading = false;
            state.FOs = action.payload.data;
        },
        getFOsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching Fos failed', {
                autoClose: 2000
            });
        },
        getTcTeamLeads: (state) => {
            state.loading = true;
            state.error = null;
        },
        getTcTeamLeadsSuccess: (state, action) => {
            state.loading = false;
            state.tcLeads = action.payload.data;
        },
        getTcTeamLeadsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error('fetching telecaller Team leads failed', {
                autoClose: 2000
            });
        },

        // getTelecallers: (state) => {
        //     state.loading = true;
        //     state.error = null;
        // },
        // getTelecallersSuccess: (state, action) => {
        //     state.loading = false;
        //     state.teleCallers = action.payload.data;
        // },
        // getTelecallersFail: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        //     toast.error('fetching telecallers failed', {
        //         autoClose: 2000
        //     });
        // },

        clearmasterData: (state) => {
            state.masterDatalist = []
        },

        clearUsersData: (state) => {
            state.masterDatalist = []
            state.regionalHeads = []
            state.stateHeads = []
            state.areaManagers = []
            state.FOs = []
            state.tcLeads = []
            state.teleCallers = []
        }
    }
});

export const {
    getCommonData,
    getCommonDataSuccess,
    getCommonDataFail,

    clearStateHeads,
    getStateHeads,
    getStateHeadsSuccess,
    getStateHeadsFail,

    clearRegionalHeads,
    getRegionalHeads,
    getRegionalHeadsSuccess,
    getRegionalHeadsFail,

    getAreaManagers,
    clearAreaManagers,
    getAreaManagersSuccess,
    getAreaManagersFail,

    clearFOs,
    getFOs,
    getFOsSuccess,
    getFOsFail,

    getTcTeamLeads,
    getTcTeamLeadsSuccess,
    getTcTeamLeadsFail,
   

    clearmasterData,
    clearUsersData
} = masterDataSlice.actions;

export default masterDataSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        creating: false,
        importing: false,
        createError: null,
        importError: null,
        createdTelecaller: null,
        importResult: null,
        loading: false,
        telecallers: [],
        error: null
    },
    reducers: {
        createTelecaller: (state) => {
            state.creating = true;
            state.createError = null;
        },
        createLead: (state) => {
            state.creating = true;
            state.createError = null;
        },
        createTelecallerSuccess: (state, action) => {
            state.creating = false;
            state.createdTelecaller = action.payload.data || action.payload;
            toast.success('Telecaller created successfully', { autoClose: 2000 });
        },
        createLeadSuccess: (state, action) => {
            state.creating = false;
            // payload may contain created lead
            state.createdLead = action.payload.data || action.payload;
            toast.success('Lead created successfully', { autoClose: 2000 });
        },
        createLeadFail: (state, action) => {
            state.creating = false;
            state.createError = action.payload;
            toast.error(action.payload?.message || 'Failed to create lead', { autoClose: 2000 });
        },
        createTelecallerFail: (state, action) => {
            state.creating = false;
            state.createError = action.payload;
            toast.error(action.payload?.message || 'Failed to create telecaller', { autoClose: 2000 });
        },
        updateTelecaller: (state) => {
            state.creating = true;
            state.createError = null;
        },
        updateTelecallerSuccess: (state, action) => {
            state.creating = false;
            state.updatedTelecaller = action.payload.data || action.payload;
        },
        updateTelecallerFail: (state, action) => {
            state.creating = false;
            state.createError = action.payload;
            toast.error(action.payload?.message || 'Failed to update telecaller', { autoClose: 2000 });
        },
        deleteTelecaller: (state) => {
            state.creating = true;
            state.createError = null;
        },
        deleteTelecallerSuccess: (state, action) => {
            state.creating = false;
            state.deletedTelecaller = action.payload.data || action.payload;
        },
        deleteTelecallerFail: (state, action) => {
            state.creating = false;
            state.createError = action.payload;
            toast.error(action.payload?.message || 'Failed to delete telecaller', { autoClose: 2000 });
        },
        getTelecallers: (state) => {
            state.loading = true;
            state.error = null;
        },
        getTelecallersSuccess: (state, action) => {
            state.loading = false;
            state.telecallers = action.payload.data || [];
        },
        getTelecallersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload?.message || 'Failed to fetch telecallers', { autoClose: 2000 });
        },
        importLeads: (state) => {
            state.importing = true;
            state.importError = null;
            state.importResult = null;
        },
        importLeadsSuccess: (state, action) => {
            state.importing = false;
            state.importResult = action.payload;
            const { totalRows, insertedCount, skippedCount } = action.payload;
            toast.success(`Successfully imported ${insertedCount} leads. ${skippedCount} leads skipped.`, { autoClose: 3000 });
        },
        importLeadsFail: (state, action) => {
            state.importing = false;
            state.importError = action.payload;
            toast.error(action.payload?.message || 'Failed to import leads', { autoClose: 2000 });
        }
    }
});

export const {
    createTelecaller, createTelecallerSuccess, createTelecallerFail,
    createLead, createLeadSuccess, createLeadFail,
    getTelecallers, getTelecallersSuccess, getTelecallersFail,
    updateTelecaller, updateTelecallerSuccess, updateTelecallerFail,
    deleteTelecaller, deleteTelecallerSuccess, deleteTelecallerFail,
    importLeads, importLeadsSuccess, importLeadsFail
} = adminSlice.actions;
export default adminSlice.reducer;

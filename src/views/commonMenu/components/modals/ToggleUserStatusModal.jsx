import React, { useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions, Button, Typography, Box, DialogTitle, Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { IconToggleRight, IconAlertTriangle } from '@tabler/icons-react';
import Status from 'ui-component/Status';
import { clearCommonMenuData, updateDocbyId, updateUserStatus } from 'container/commonMenuContainer/slice';

const ToggleUserStatusModal = ({ open, handleClose, selectedUser, setSelectedUser, menuConfig, id }) => {
    const dispatch = useDispatch();
    const toggleUserStatusSuccess = useSelector((state) => state.commonMenu?.updateDocbyIdSuccess); // Updated selector

    const initialValues = {
        status: !selectedUser?.status === "Active", // Initialize to opposite of current status
    };

    const validationSchema = Yup.object().shape({
        status: Yup.boolean().required('Status is required'),
    });

    // Form submission
    const handleSubmit = (values) => {
        const isActive = selectedUser?.status === "Active";
        const newStatus = isActive ? "Disabled" : "Active"; // Toggle status based on current state

        const data = {
            status: newStatus,
        };
        dispatch(clearCommonMenuData());
        dispatch(updateDocbyId({
            docName: "users",
            id: selectedUser?.id || id,
            data: data,
            baseFilter: menuConfig?.baseFilter
            // isNoReload: true
        }));
    };

    // Clear selected user on success
    useEffect(() => {
        if (toggleUserStatusSuccess) {
            setSelectedUser(null);
            handleClose(); // Optional: Close modal on success
        }
    }, [toggleUserStatusSuccess, setSelectedUser, handleClose]);

    const isActive = selectedUser?.status === "Active";

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90vw', padding: 2 } }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isValid }) => (
                    <Form>
                        <DialogTitle
                            sx={{
                                px: 3,
                                py: 1,
                                pt: 2,
                                mb: 2,
                                borderBottom: '1px dashed #e6e6e6',
                                fontSize: '1.05rem',
                                color: 'gray',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <IconToggleRight size={27} stroke={2} style={{ marginRight: '12px' }} />
                            Toggle User Status
                        </DialogTitle>

                        <DialogContent sx={{ py: 2 }}>
                            <Grid container spacing={2}>
                                {/* User Details - Always Visible */}
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, paddingTop: 3, borderRadius: 2, bgcolor: '#f2f2f2' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body1" color="text.secondary">
                                                    User ID: <strong>{selectedUser?.id || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Name: <strong>{selectedUser?.fullName || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid mt={0.75} item xs={12} md={6}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Role: <strong>{selectedUser?.role || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2 }} md={6}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Current Status:
                                                </Typography>
                                                <strong>
                                                    <Status status={selectedUser?.status} />
                                                </strong>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* Toggle Status - Hidden on Success */}
                                {selectedUser ? (
                                    <Grid item xs={12}>
                                        {!toggleUserStatusSuccess && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {isActive
                                                            ? 'Click the button below to disable the user.'
                                                            : 'Click the button below to activate the user.'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )}

                                        {/* Success Message */}
                                        {toggleUserStatusSuccess && (
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: '1px dashed #4caf50',
                                                    textAlign: 'center',
                                                    mt: 2,
                                                    bgcolor: '#f0fdf4',
                                                }}
                                            >
                                                <IconToggleRight
                                                    size={40}
                                                    stroke={2}
                                                    color="#4caf50"
                                                    style={{ mb: 1 }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ mb: 1, fontWeight: 500, color: '#2e7d32' }}
                                                >
                                                    Status Updated Successfully
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    New Status: {isActive ? 'Disabled' : 'Active'}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={handleClose}
                                                >
                                                    Done
                                                </Button>
                                            </Box>
                                        )}
                                    </Grid>
                                ) : (
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: '1px dashed #ffa726',
                                                textAlign: 'center',
                                                mt: 2,
                                            }}
                                        >
                                            <IconAlertTriangle
                                                size={40}
                                                stroke={2}
                                                color="#ffa726"
                                                style={{ mb: 1 }}
                                            />
                                            <Typography
                                                variant="h6"
                                                sx={{ mb: 1, fontWeight: 500 }}
                                            >
                                                No User Selected
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                Please select a user to toggle their status.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleClose}
                                            >
                                                Close
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>

                        {selectedUser && !toggleUserStatusSuccess && (
                            <DialogActions sx={{ px: 3, py: 2 }}>
                                <Button onClick={handleClose} variant="outlined" color="secondary">
                                    Close
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    // color={isActive ? 'error' : ''}
                                    style={{ color: isActive ? '#ad0202' : '#017803' }}
                                    disabled={!isValid}
                                >
                                    {isActive ? 'Disable User' : 'Activate User'}
                                </Button>
                            </DialogActions>
                        )}
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default ToggleUserStatusModal;
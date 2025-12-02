import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogContent, DialogActions, Button, Typography, Box, DialogTitle, Grid, TextField, IconButton, InputAdornment
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IconLock } from '@tabler/icons-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from 'container/userContainer/slice';

const ResetUserPasswordModal = ({ open, handleClose, selectedUser }) => {
    const dispatch = useDispatch();
    const resetPasswordSuccess = useSelector((state) => state.user?.resetPasswordSuccess);
    const loading = useSelector((state) => state.user?.loading);

    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        password: '',
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &)')
            .required('Password is required'),
    });

    const handleSubmit = (values) => {
        const data = {
            email: selectedUser?.email,
            newPassword: values.password,
        };
        dispatch(resetPassword(data));
    };

    // useEffect(() => {
    //     if (resetPasswordSuccess) {
    //         // setSelectedUser(null);
    //         handleClose();
    //     }
    // }, [resetPasswordSuccess, handleClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '90vw', padding: 2 } }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, errors, touched, isValid }) => (
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
                            <IconLock size={27} stroke={2} style={{ marginRight: '12px' }} />
                            Reset User Password
                        </DialogTitle>

                        <DialogContent sx={{ py: 2 }}>
                            <Grid container spacing={2}>
                                {/* User Details */}
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, paddingTop: 3, borderRadius: 2, bgcolor: '#f2f2f2' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12}>
                                                <Typography variant="body1" color="text.secondary">
                                                    ID: <strong>{selectedUser?.id || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Name: <strong>{selectedUser?.fullName || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Email: <strong>{selectedUser?.email || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Role: <strong>{selectedUser?.role || 'N/A'}</strong>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {selectedUser ? (
                                    <Grid item xs={12}>
                                        {!resetPasswordSuccess && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                        Enter a new password for the user:
                                                    </Typography>
                                                    <Field
                                                        as={TextField}
                                                        name="password"
                                                        label="New Password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        fullWidth
                                                        variant="outlined"
                                                        error={touched.password && !!errors.password}
                                                        helperText={touched.password && errors.password}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}

                                        {resetPasswordSuccess && (
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
                                                <IconLock
                                                    size={40}
                                                    stroke={2}
                                                    color="#4caf50"
                                                    style={{ mb: 1 }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ mb: 1, fontWeight: 500, color: '#2e7d32' }}
                                                >
                                                    Password Reset Successfully
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    The user's password has been updated.
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
                                            <IconLock
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
                                                Please select a user to reset their password.
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

                        {selectedUser && !resetPasswordSuccess && (
                            <DialogActions sx={{ px: 3, py: 2 }}>
                                <Button onClick={handleClose} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    style={{ color: '#017803' }}
                                    disabled={!isValid || loading}
                                >
                                    Reset Password
                                </Button>
                            </DialogActions>
                        )}
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default ResetUserPasswordModal;
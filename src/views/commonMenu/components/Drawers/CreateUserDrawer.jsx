import React, { useState, useEffect } from 'react'; // Added useEffect
import {
    Drawer, Button, Box, Grid, Typography, TextField, MenuItem, FormControlLabel, Checkbox, IconButton,
    Divider, Autocomplete, InputAdornment,
    Card,
    CardContent,
    Avatar,
    capitalize
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { useTheme } from '@emotion/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { clearmasterData, getCommonData } from 'container/masterDataContainer/slice';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from 'container/userContainer/slice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { stateCodeMapping } from 'utils/stateCodeMapping';
import { toast } from 'react-toastify';

const allRoles = [
    "Management",
    "Regional Head",
    "Advocate",
    "State Head",
    "Area Manager",
    "Field Officer",
    "TC Team Lead",
    "Tele Caller",
    "Tellecaller-Inbound",
    "Agency"
];

const allDesignations = [
    "Director",
    "CEO",
    "Assistant Manager-NPA Resolution",
    "Analyst",
    "Engineer",
    "Accountant",
    "Secretary",
    "Associate",
    "Administrative Officer",
    "Business Development Manager",
    "HR Manager",
    "Project Manager",
    "Head of Marketing and Sales",
    "Software Developer",
    "Designer",
    "Researcher",
    "Tele Caller",
    "Field Officer",
    "Advocate",
    "Regional Head",
    "State Head",
    "Area Manager",
    "Agency",
    "Accounts",
    "Executive Director",
    "Business Head",
    "Back Office"
];
const validationSchema = Yup.object({
    id: Yup.string().required('HR-EMP ID is required'),
    firstName: Yup.string().required('First Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
        .required('Mobile is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &)')
        .required('Password is required'),
    dateOfJoining: Yup.string()
        .required('Date of Joining is required'),
    role: Yup.string().required('Role is required'),
    designation: Yup.string().required('Designation is required'),
    reportsTo: Yup.string().when('role', {
        is: (role) => role && !['Management', 'Regional Head'].includes(role),
        then: (schema) => schema.required('Reports To is required for roles other than Management and Regional Head'),
        otherwise: (schema) => schema.notRequired(),
    }),
    reportsToName: Yup.string().when('role', {
        is: (role) => role && !['Management', 'Regional Head'].includes(role),
        then: (schema) => schema.required('Reports To Name is required for roles other than Management and Regional Head'),
        otherwise: (schema) => schema.notRequired(),
    }),
    state: Yup.string().when('role', {
        is: (role) => ['Field Officer', 'Area Manager', 'State Head'].includes(role),
        then: (schema) => schema.required('State is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    district: Yup.string().when('role', {
        is: (role) => role === 'Field Officer',
        then: (schema) => schema.required('District is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    // radius: Yup.number()
    //     .typeError('Radius must be a number')
    //     .when('role', {
    //         is: (role) => ['Field Officer', 'Area Manager'].includes(role),
    //         then: (schema) =>
    //             schema
    //                 .required('Radius is required for Field Officer and Area Manager')
    //                 .positive('Radius must be a positive number'),
    //         otherwise: (schema) => schema.notRequired(),
    //     }),
    // homeGeoLoc: Yup.string().when('role', {
    //     is: (role) => ['Field Officer', 'Area Manager'].includes(role),
    //     then: (schema) =>
    //         schema
    //             .required('Home Geo Location is required for Field Officer and Area Manager')
    //             .matches(
    //                 /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/,
    //                 'Home Geo Location must be in the format "lat,long" (e.g., 33.2321,77.727)'
    //             ),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
});

const CreateUserDrawer = ({ open, handleCloseDrawer }) => {
    const theme = useTheme();
    const filterData = useSelector((state) => state.masterData?.masterDatalist || []);
    const createUserSuccess = useSelector((state) => state.user?.createUserSuccess || false);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const initialValues = {
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: 'Abcd@1234',
        role: '',
        photo: null,
        designation: '',
        isEmployee: true,
        dateOfJoining: '',
        radius: null,
        district: '',
        employmentType: '',
        homeGeoLoc: '',
        portalAccess: false,
        reportsTo: '',
        reportsToName: '',
        state: '',
        stateCode: ''
    };


    const hanldeDropDownDatafetch = (endPoint) => {
        if (endPoint) {
            dispatch(getCommonData({
                endPoint: endPoint,
                params: {
                    size: 50,
                },
            }));
        }
    };

    useEffect(() => {
        if (createUserSuccess) {
            handleCloseDrawer()
        }
    }, [createUserSuccess])


    const getFilteredOptions = (role, data) => {
        if (role === 'Field Officer') {
            return data.filter((user) => ['State Head', 'Area Manager', 'Regional Head'].includes(user.role));
        } else if (role === 'Area Manager') {
            return data.filter((user) => ['Regional Head', 'State Head'].includes(user.role));
        } else if (role === 'State Head') {
            return data.filter((user) => ['Regional Head', 'Management'].includes(user.role));
        } else if (role === 'Regional Head') {
            return data.filter((user) => ['Management'].includes(user.role));
        } else {
            // Default filter: exclude Field Officer and Tele Caller
            return data.filter((user) => user.role !== 'Field Officer' && user.role !== 'Tele Caller');
        }
    };

    const handlePhotoChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.warn("File size must be less than 2MB")
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                toast.warn("Only image files are allowed")
                return;
            }

            setFieldValue('photo', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoRemove = (setFieldValue) => {
        setFieldValue('file', null);
        setPhotoPreview(null);
    };

    const handleSubmit = (values) => {
        const filteredValues = {
            ...Object.fromEntries(
                Object.entries(values).filter(([_, v]) => v !== null && v !== '')
            )
        };

        if (filteredValues.radius) {
            filteredValues.radius = Number(filteredValues.radius) * 1000;
        }
        if (filteredValues.photo && filteredValues.firstName && filteredValues.id) {
            const originalFile = filteredValues.photo;
            const extension = originalFile.name.split('.').pop();
            const newFileName = `${filteredValues.firstName}_${filteredValues.id}.${extension}`;

            filteredValues.photo = new File(
                [originalFile],
                newFileName,
                { type: originalFile.type }
            );

            delete filteredValues.file;
        } else {

        }
        // console.log('Modified User Data :', filteredValues);
        dispatch(createUser(filteredValues));
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleCloseDrawer}
            sx={{
                width: {
                    xs: '100%',
                    sm: '70%',
                    md: '70%',
                    lg: '90%',
                },
                '& .MuiDrawer-paper': {
                    width: {
                        xs: '100%',
                        sm: '100%',
                        md: '90%',
                        lg: '70%',
                    },
                    padding: '3% 2% 1.5% 3%',
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '90vh'
            }}>
                {/* Header */}
                <Box sx={{ flexShrink: 0 }}>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Grid item>
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    Create User
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <IconButton
                                size='30px'
                                onClick={handleCloseDrawer}
                                sx={{ padding: '8px', borderRadius: '50%', '&:hover': { backgroundColor: '#e0e0e0' } }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider />
                </Box>

                {/* Form */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.grey[100],
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[400],
                        borderRadius: '10px',
                    },
                }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, handleChange, handleBlur, values, setFieldValue }) => (
                            <Form>
                                <div style={{ marginTop: "30px" }}>
                                    <Grid sx={{
                                        paddingBottom: "30px",
                                        maxHeight: '77vh',
                                        overflowY: "auto",
                                        paddingRight: 1,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#cfcccc',
                                            borderRadius: '10px',
                                        },
                                    }}
                                        container spacing={2}>
                                        <Grid item xs={12} >
                                            <Grid
                                                container
                                                spacing={1}
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="flex-start"
                                                alignContent="stretch"
                                                wrap="wrap"

                                            >
                                                <Grid item xs={10}>
                                                    {/* <Grid item xs={12}> */}
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="HR-EMP ID"
                                                                name="id"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.id}
                                                                error={touched.id && !!errors.id}
                                                                helperText={touched.id && errors.id}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="First Name"
                                                                name="firstName"
                                                                onChange={(e) => {
                                                                    const value = capitalize(e.target.value);
                                                                    handleChange({
                                                                        target: {
                                                                            name: 'firstName',
                                                                            value: value,
                                                                        },
                                                                    });
                                                                }}
                                                                // onChange={handleChange}

                                                                onBlur={handleBlur}
                                                                value={values.firstName}
                                                                error={touched.firstName && !!errors.firstName}
                                                                helperText={touched.firstName && errors.firstName}
                                                                required
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="Middle Name"
                                                                name="middleName"
                                                                // onChange={handleChange}
                                                                onChange={(e) => {
                                                                    const value = capitalize(e.target.value);
                                                                    handleChange({
                                                                        target: {
                                                                            name: 'middleName',
                                                                            value: value,
                                                                        },
                                                                    });
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.middleName}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="Last Name"
                                                                name="lastName"
                                                                // onChange={handleChange}
                                                                onChange={(e) => {
                                                                    const value = capitalize(e.target.value);
                                                                    handleChange({
                                                                        target: {
                                                                            name: 'lastName',
                                                                            value: value,
                                                                        },
                                                                    });
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.lastName}
                                                                error={touched.lastName && !!errors.lastName}
                                                                helperText={touched.lastName && errors.lastName}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="Mobile"
                                                                name="mobile"
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/\D/g, '');
                                                                    if (value.length <= 10) {
                                                                        handleChange({
                                                                            target: {
                                                                                name: 'mobile',
                                                                                value: value,
                                                                            },
                                                                        });
                                                                    }
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.mobile}
                                                                error={touched.mobile && !!errors.mobile}
                                                                helperText={touched.mobile && errors.mobile}
                                                                required
                                                                inputProps={{
                                                                    maxLength: 10,
                                                                    inputMode: 'numeric',
                                                                    pattern: '[0-9]*',
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="Email"
                                                                name="email"
                                                                type="email"
                                                                autoComplete='off'
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.email}
                                                                error={touched.email && !!errors.email}
                                                                helperText={touched.email && errors.email}
                                                                required
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                label="Password"
                                                                name="password"
                                                                type={showPassword ? "text" : "password"}
                                                                autoComplete="new-password"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.password}
                                                                error={touched.password && !!errors.password}
                                                                helperText={touched.password && errors.password}
                                                                required
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
                                                                    )
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                select
                                                                label="Designation"
                                                                name="designation"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    // const selectedRole = e.target.value;
                                                                    // // Automatically set portalAccess to true for State Head or Management
                                                                    // if (selectedRole === "State Head" || selectedRole === "Management") {
                                                                    //     setFieldValue("portalAccess", true);
                                                                    // } else {
                                                                    //     setFieldValue("portalAccess", false);
                                                                    // }
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.designation}
                                                                error={touched.designation && !!errors.designation}
                                                                helperText={touched.designation && errors.designation}
                                                                required
                                                            >
                                                                {allDesignations.map((designation) => (
                                                                    <MenuItem key={designation} value={designation}>
                                                                        {designation}
                                                                    </MenuItem>
                                                                ))}
                                                            </Field>
                                                        </Grid>

                                                        <Grid item xs={12} sm={6} lg={4}>
                                                            <Field
                                                                as={TextField}
                                                                fullWidth
                                                                select
                                                                label="Role"
                                                                name="role"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setFieldValue('reportsToName', "");
                                                                    setFieldValue('reportsTo', "");
                                                                    setFieldValue('zone', "");
                                                                    const selectedRole = e.target.value;
                                                                    // Automatically set portalAccess to true for State Head or Management
                                                                    if (selectedRole === "State Head" || selectedRole === "Regional Head" || selectedRole === "Management") {
                                                                        setFieldValue("portalAccess", true);
                                                                    } else {
                                                                        setFieldValue("portalAccess", false);
                                                                    }
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.role}
                                                                error={touched.role && !!errors.role}
                                                                helperText={touched.role && errors.role}
                                                                required
                                                            >
                                                                {allRoles.map((role) => (
                                                                    <MenuItem key={role} value={role}>
                                                                        {role}
                                                                    </MenuItem>
                                                                ))}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Box sx={{ position: 'relative', m: 1, p: 1, pt: 1.5, borderRadius: 3, mb: 2, border: '1px dashed #ccc' }}>
                                                        <Typography variant="caption" gutterBottom sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            left: 8, fontSize: '0.6rem',
                                                            backgroundColor: "white"
                                                        }}>
                                                            Profile Photo
                                                        </Typography>
                                                        <Box sx={{ position: 'relative', width: 'fit-content' }}>
                                                            <input
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                id="photo-upload"
                                                                type="file"
                                                                onChange={(e) => handlePhotoChange(e, setFieldValue)}
                                                            />
                                                            <label title='click to select photo' htmlFor="photo-upload">
                                                                <Box
                                                                    sx={{
                                                                        width: "100%",
                                                                        height: 155,
                                                                        borderRadius: 2,
                                                                        border: '2px solid #ccc',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        cursor: 'pointer',
                                                                        overflow: 'hidden',
                                                                        bgcolor: '#f5f5f5',
                                                                        '&:hover': { opacity: 0.8 },
                                                                    }}
                                                                >
                                                                    {photoPreview ? (
                                                                        <img
                                                                            src={photoPreview}
                                                                            alt="Profile preview"
                                                                            style={{ boxShadow: 2, width: '100%', height: '100%', objectFit: 'cover' }}
                                                                        />
                                                                    ) : (
                                                                        <PhotoCameraIcon sx={{ padding: "20px", width: '100%', height: '100%', color: '#666' }} />
                                                                    )}
                                                                </Box>
                                                            </label>
                                                            {photoPreview && (
                                                                <IconButton
                                                                    size="small"
                                                                    title='clear'
                                                                    onClick={() => handlePhotoRemove(setFieldValue)}
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: -8,
                                                                        right: -8,
                                                                        bgcolor: 'white',
                                                                        color: 'gray',
                                                                        opacity: 1,
                                                                        '&:hover': { boxShadow: "1px 1px 10px #d1d1d1", backgroundColor: "white" },
                                                                        p: 0.2,
                                                                    }}
                                                                >
                                                                    <CloseIcon fontSize="10px" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                        {touched.photo && errors.photo && (
                                                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                                                {errors.photo}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>



                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Date of Joining"
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            size: 'medium',
                                                            error: touched.dateOfJoining && !!errors.dateOfJoining,
                                                            helperText: touched.dateOfJoining && errors.dateOfJoining,
                                                            name: 'dateOfJoining',
                                                        },
                                                    }} format="DD-MM-YYYY"
                                                    value={values.dateOfJoining ? dayjs(values.dateOfJoining) : null}
                                                    onChange={(newValue) => {
                                                        setFieldValue('dateOfJoining', newValue ? newValue.format('YYYY-MM-DD') : '');
                                                    }}
                                                    maxDate={dayjs()}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        {/* {values.role == "Regional Head" &&} */}
                                        {/*-------- zone/region field is not in the doc--- */}
                                        {/* <Grid display={"none"} item xs={12} sm={6} lg={4}>
                                                <Field
                                                    name="zone"
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            options={[{ id: 1, zone: "south" }, { id: 2, zone: "east" }]}
                                                            value={values.zone}
                                                            getOptionLabel={(option) => option.zone || (typeof (option) == "string") && option || ""}
                                                            onChange={(e, value) => {
                                                                const selectedZone = value ? value.zone : '';
                                                                // const stateCode = stateCodeMapping.find(item => item.zone === selectedState)?.zoneCode || '';
                                                                setFieldValue('zone', selectedZone);
                                                                setFieldValue('state', "");
                                                                setFieldValue('stateCode', "");
                                                                setFieldValue('district', "");
                                                                // setFieldValue('stateCode', stateCode);
                                                            }}

                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Zone"
                                                                    fullWidth
                                                                    onBlur={handleBlur}
                                                                    error={touched.zone && !!errors.zone}
                                                                    helperText={touched.zone && errors.zone}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                name="state"
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        options={filterData || []}
                                                        value={values.state}
                                                        getOptionLabel={(option) => option.state || (typeof (option) == "string") && option || ""}
                                                        onOpen={() => hanldeDropDownDatafetch('/state')}
                                                        onChange={(e, value) => {
                                                            const selectedState = value ? value.state : '';
                                                            const stateCode = stateCodeMapping.find(item => item.state === selectedState)?.stateCode || '';
                                                            setFieldValue('state', selectedState);
                                                            setFieldValue('stateCode', stateCode);
                                                        }}
                                                        onInputChange={(e) => {
                                                            if (e?.target?.value) {
                                                                dispatch(getCommonData({
                                                                    endPoint: '/state',
                                                                    params: {
                                                                        searchField: "state" || "value",
                                                                        searchTerm: e.target.value,
                                                                    },
                                                                }));
                                                            }
                                                        }}
                                                        onFocus={() => dispatch(clearmasterData())}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="State"
                                                                fullWidth
                                                                onBlur={handleBlur}
                                                                error={touched.state && !!errors.state}
                                                                helperText={touched.state && errors.state}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="State Code"
                                                name="stateCode"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values?.stateCode}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                name="district"
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={values?.district}
                                                        options={filterData || []}
                                                        getOptionLabel={(option) => option?.district || (typeof (option) == "string") && option || ""}
                                                        onOpen={() => hanldeDropDownDatafetch('/district')}
                                                        onChange={(e, value) => setFieldValue('district', value ? value.district : '')}
                                                        onInputChange={(e) => {
                                                            if (e?.target?.value) {
                                                                dispatch(getCommonData({
                                                                    endPoint: '/district',
                                                                    params: {
                                                                        searchField: "district" || "value",
                                                                        searchTerm: e.target.value,
                                                                    },
                                                                }));
                                                            }
                                                        }}
                                                        onFocus={() => dispatch(clearmasterData())}

                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="District"
                                                                fullWidth
                                                                onBlur={handleBlur}
                                                                error={touched.district && !!errors.district}
                                                                helperText={touched.district && errors.district}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                name="employmentType"
                                                render={({ field, form }) => (
                                                    <TextField
                                                        {...field}
                                                        select
                                                        fullWidth
                                                        label="Employment Type"
                                                        onBlur={handleBlur}
                                                        value={form.values.employmentType || ''} // Ensure a default value
                                                        error={form.touched.employmentType && !!form.errors.employmentType}
                                                        helperText={form.touched.employmentType && form.errors.employmentType}
                                                    >
                                                        <MenuItem value="Full Time">Full Time</MenuItem>
                                                        <MenuItem value="Part Time">Part Time</MenuItem>
                                                        <MenuItem value="Freelance">Freelance</MenuItem>
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                name="reportsToName"
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        options={getFilteredOptions(values.role, filterData) || []} // Apply conditional filtering based on role                                                        value={values.reportsToName}
                                                        getOptionLabel={(option) => option.fullName || (typeof option === "string" && option) || ""} // Only fullName in the input field
                                                        onOpen={() => hanldeDropDownDatafetch('/users')}
                                                        onChange={(e, value) => {
                                                            setFieldValue('reportsToName', value ? value.fullName : '');
                                                            setFieldValue('reportsTo', value ? value.id : '');
                                                        }}
                                                        onFocus={() => dispatch(clearmasterData())}
                                                        onInputChange={(e) => {
                                                            if (e?.target?.value) {
                                                                dispatch(getCommonData({
                                                                    endPoint: '/users',
                                                                    params: {
                                                                        searchField: "fullName" || "value",
                                                                        searchTerm: e.target.value,
                                                                    },
                                                                }));
                                                            }
                                                        }}
                                                        renderOption={(props, option) => (
                                                            <li {...props}>
                                                                {option.fullName} ({option.role}) {/* Role shown in dropdown */}
                                                            </li>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Reports To Name"
                                                                fullWidth
                                                                onBlur={handleBlur}
                                                                error={touched.reportsToName && !!errors.reportsToName}
                                                                helperText={touched.reportsToName && errors.reportsToName}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Reports To (ID)"
                                                name="reportsTo"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.reportsTo}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Home Geo Location (lat,long)"
                                                name="homeGeoLoc"
                                                placeholder="e.g. 33.2321,77.727"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.homeGeoLoc}
                                                error={touched.homeGeoLoc && !!errors.homeGeoLoc}
                                                helperText={touched.homeGeoLoc && errors.homeGeoLoc}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Radius(km)"
                                                name="radius"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.radius}
                                                error={touched.radius && !!errors.radius}
                                                helperText={touched.radius && errors.radius}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        as={Checkbox}
                                                        name="isEmployee"
                                                        checked={values.isEmployee}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                sx={{ pl: 1 }}
                                                label="Is Employee"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        as={Checkbox}
                                                        name="portalAccess"
                                                        checked={values.portalAccess}
                                                        onChange={handleChange}
                                                        // disabled={values.role === "State Head" || values.role === "Management"} // Disable for State Head or Management
                                                        disabled
                                                    />
                                                }
                                                sx={{ pl: 1 }}
                                                label="Portal Access"
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Box>

                {/* Footer */}
                <Box sx={{
                    flexShrink: 0,
                    p: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={handleCloseDrawer}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                sx={{ py: 1 }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ py: 1 }}
                                onClick={() => document.querySelector('form').requestSubmit()}
                            >
                                Create User
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Drawer >
    );
};

export default CreateUserDrawer;
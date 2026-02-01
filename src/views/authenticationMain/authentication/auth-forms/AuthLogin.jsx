import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Alert, CircularProgress, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { selectError, userLogin } from 'container/LoginContainer/slice';
import { Link, useNavigate } from 'react-router-dom';

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorRespHndle = useSelector(selectError);
  const loading = useSelector((state) => state.login.loading);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setStatus({ success: true });
          setSubmitting(false);
          const payload = {
            email: values.email,
            password: values.password,
            navigate: navigate
          };
          dispatch(userLogin(payload));
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px' },
            mx: 'auto'
          }}
          {...others}
        >
          <Stack spacing={2.5}>
            {/* Email Field */}
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              size="medium"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '48px',
                  fontSize: '14px'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '12px'
                }
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              size="medium"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '48px',
                  fontSize: '14px'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '12px'
                }
              }}
            />

            {/* Error Alerts */}
            {(errors.submit || errorRespHndle) && (
              <Box>
                {errors.submit && (
                  <Alert
                    severity="error"
                    size="small"
                    sx={{
                      fontSize: '13px',
                      py: 1,
                      '& .MuiAlert-message': {
                        fontSize: '13px'
                      }
                    }}
                  >
                    {errors.submit}
                  </Alert>
                )}
                {errorRespHndle?.status === 404 && (
                  <Alert
                    severity="error"
                    size="small"
                    sx={{
                      fontSize: '13px',
                      py: 1,
                      '& .MuiAlert-message': {
                        fontSize: '13px'
                      }
                    }}
                  >
                    Incorrect username or password
                  </Alert>
                )}
              </Box>
            )}

            {/* Submit Button */}
            <AnimateButton>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                sx={{
                  height: '35px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  position: 'relative',
                  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.2)'
                  },
                  '&:disabled': {
                    opacity: 0.7,
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      thickness={4}
                      sx={{
                        color: theme.palette.secondary.contrastText,
                        position: 'absolute'
                      }}
                    />
                    <Box component="span" sx={{ opacity: 0 }}>
                      Sign In 
                    </Box>
                  </>
                ) : (
                  <Box component="span">Sign In </Box>
                )}
              </Button>
            </AnimateButton>
          </Stack>
        </Box>
      )}
    </Formik>
  );
};

export default AuthLogin;

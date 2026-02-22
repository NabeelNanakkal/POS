// import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, useTheme } from '@mui/material';
// import { Link as MuiLink } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../authentication/auth-forms/AuthLogin';
import AuthFooter from 'components/cards/AuthFooter';
// import Logo from 'components/Logo';
// import Logo from 'assets/images/logo.svg';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden', // Prevent horizontal scroll only
          overflowY: 'auto' // Allow vertical scroll if needed
        }}
      >
        {/* Main content area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 1, sm: 2 },
            minHeight: 'calc(100vh - 120px)' // Adjust based on footer height
          }}
        >
          <AuthCardWrapper>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid sx={{ mb: 3 }}>
   <Typography 
        variant="h1" 
        sx={{ 
          fontWeight: 900,
          color: theme.palette.primary.main,
          mt: 1
        }}
      >
        BIZOWICE  
      </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                  <Grid sx={{ mt: -3 }}>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                      <Typography gutterBottom fontSize="16px" variant='subtitle1'>
                        Welcome Back
                      </Typography>
                      <Typography variant="caption" fontSize="12px" textAlign={{ xs: 'center', md: 'inherit' }}>
                        Access Your Lead Management Workspace.
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <AuthLogin />
              </Grid>
              {/* <Grid size={{ xs: 12 }}>
                <Stack alignItems="center" mt={-1} justifyContent="center" spacing={1}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: 'none',
                      // fontSize: { xs: '7px', sm: '10px', md: '12px', lg: '14px', xl: '20px' },
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    Don&apos;t have an account ?{' '}
                    <MuiLink
                      component={Link}
                      to="/signup"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        ml: '4px',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign up
                    </MuiLink>
                  </Typography>
            
                </Stack>
              </Grid> */}
            </Grid>
          </AuthCardWrapper>
        </Box>

        {/* Footer area */}
        <Box
          sx={{
            flexShrink: 0,
            padding: 3,
            paddingTop: 1
          }}
        >
          <AuthFooter />
        </Box>
      </Box>
    </AuthWrapper1>
  );
};

export default Login;

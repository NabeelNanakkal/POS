import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Box, Button, darken, IconButton, Tooltip } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthRegister from '../authentication/auth-forms/AuthRegister';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../authentication/auth-forms/style';
import Logo from 'ui-component/Logo';
import logo2 from 'assets/images/logo.svg';

// role selector
import RoleSelector from '../authentication/auth-forms/components/RoleSelector';
import UserIcon from 'assets/images/users/user-round.svg';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const RoleCarousel = ({ roles, selectedRole, handleRoleSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? roles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === roles.length - 1 ? 0 : prev + 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'absolute'
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: 'absolute'
    })
  };
  return (
    <Box textAlign="center">
      <Grid container justifyContent="center" sx={{ border: '0.5px solid lightgrey', p: 2, borderRadius: '24px' }}>
        <Grid item>
          <Box mt={2} display="flex" justifyContent="center" gap={2} alignItems="center">
            {/* Prev Button */}
            <IconButton onClick={handlePrev}>
              <ChevronLeft />
            </IconButton>

            {/* Role Carousel */}
            <Box
              sx={{
                width: 220,
                height: 160,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* <AnimatePresence custom={direction} mode="wait"> */}
              {/* <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute', // important!
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                > */}
              <RoleSelector
                icon={roles[currentIndex].icon}
                title={roles[currentIndex].title}
                isSelected={selectedRole === roles[currentIndex].id}
                onSelect={() => handleRoleSelect(roles[currentIndex].id)}
              />
              {/* </motion.div> */}
              {/* </AnimatePresence> */}
            </Box>

            {/* Next Button */}
            <IconButton onClick={handleNext}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const Register = () => {
  const theme = useTheme();
  const style = styles(theme);
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedRole, setSelectedRole] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  const handleProceed = () => {
    if (selectedRole) {
      setShowRegistrationForm(true);
    }
  };

  const roles = [
    { id: 'Cashier', icon: UserIcon, title: 'Cashier' },
    { id: 'Manager', icon: UserIcon, title: 'Manager' }
  ];

  return (
    <AuthWrapper1 sx={style.loginBg}>
      <Grid container direction="column" sx={{ backgroundColor: 'inherit' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper sx={{ ...style.authCardWrapper }}>
                <Grid container spacing={2} direction={'row'} alignItems="center" justifyContent="center">
                  {/* Logo */}
                  <Grid size={12} sx={{ textAlign: 'center' }}>
                    <Link
                      to="#"
                      aria-label="theme logo"
                      style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        width: 'auto',
                        height: 'auto',
                        lineHeight: 0
                      }}
                    >
                      {/* <Logo style={{ width: '120px', height: 'auto' }} /> */}
                      <img src={logo2} alt="Logo" width="200" />
                    </Link>
                    {/* Heading */}
                    <Grid item xs={12} textAlign="center" marginTop={3}>
                      <Typography fontWeight={900} sx={style.welcomeBack} variant={downMD ? 'h6' : 'h6'}>
                        {showRegistrationForm ? 'Create Your Account' : 'Select Your Current Professional Role'}
                      </Typography>
                      <Typography variant="caption" sx={style.title}>
                        {showRegistrationForm ? '' : 'Your Role Selection Will Adjust The Portal To Suit Your Needs.'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Role selection or Register form */}
                  <Grid size={12}>
                    {!showRegistrationForm ? (
                      <Box>
                        <RoleCarousel roles={roles} selectedRole={selectedRole} handleRoleSelect={handleRoleSelect} />

                        <Box mt={3}>
                          <Tooltip title={"Please Choose a Role"} >
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              size="large"
                              onClick={handleProceed}
                              disabled={!selectedRole}
                              sx={{
                                color: 'white',
                                fontSize: '16px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#acacac' }
                              }}
                            >
                              Proceed 
                            </Button>
                          </Tooltip>
                        </Box>

                        <Box mt={3} textAlign="center">
                          <Typography
                            component={Link}
                            to="/login"
                            variant="subtitle1"
                            sx={{
                              fontSize: '14px',
                              textDecoration: 'none',
                              color: theme.palette.text.secondary,
                              '&:hover': { color: theme.palette.primary.main }
                            }}
                          >
                            Go Back to &nbsp;
                            <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>Login</span>
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <AuthRegister selectedRole={selectedRole} />
                    )}
                  </Grid>

                  <Grid size={12}>{/* <Divider />  */}</Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Register;

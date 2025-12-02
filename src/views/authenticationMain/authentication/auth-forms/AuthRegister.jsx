// ===========================|| AUTH REGISTER (Role + Register) ||=========================== //

import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// icons
import LockIcon from '@mui/icons-material/Lock';
import { IconPhoneFilled } from '@tabler/icons-react';

// redux
// import { userSignup } from 'container/RegisterContainer/slice';

// project imports
import styles from './style';
// import PCMSignUp from './components/PCMSignUp';
// import UserDetail from './components/UserDetail';

// assets
import ClaimantIcon from 'assets/images/claimant.png';
import ArbitratorIcon from 'assets/images/arb-med.png';

const AuthRegister = () => {
  const theme = useTheme();
  const style = styles(theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state?.signup?.loading);

  const [step, setStep] = useState(0); // Step 0 = Role select, Step 1 = Form, Step 2 = T&C
  const [selectedRole, setSelectedRole] = useState(null);
  const [userData, setUserData] = useState({});

  // role selection
  const roles = [
    { id: 'Law Firm', icon: ClaimantIcon, title: 'Law Firm' },
    { id: 'Arbitrator', icon: ArbitratorIcon, title: 'Arbitrator/Mediator' }
  ];

  const handleRoleSelect = (role) => setSelectedRole(role);
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleAgreeAndSubmit = () => {
    dispatch(userSignup({ data: { ...userData, role: selectedRole }, navigate }));
  };

  const handleUserDetailChange = (data) => setUserData(data);

  return (
    <div>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          {/* Progress steps */}
          {step > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              {[1, 2].map((s) => (
                <Box key={s} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: step >= s ? theme.palette.primary.main : '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step >= s ? 'white' : '#999',
                      fontWeight: 'bold'
                    }}
                  >
                    {step >= s ? s : <LockIcon sx={{ fontSize: 20, color: '#999' }} />}
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '10px', mt: 0.5 }}>
                    {s === 1 && 'User Details'}
                    {s === 2 && 'Terms & Conditions'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Step 0 - Role Selection */}
          {/* {step === 0 && (
            <Box mt={3}>
              <Grid container spacing={2} justifyContent="center">
                {roles.map((role) => (
                  <Grid item xs={12} sm={6} md={6} key={role.id}>
                    <RoleSelector
                      icon={role.icon}
                      title={role.title}
                      isSelected={selectedRole === role.id}
                      onSelect={() => handleRoleSelect(role.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box mt={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  disabled={!selectedRole}
                  sx={{
                    bgcolor: theme.palette.background.theme,
                    '&:hover': { bgcolor: theme.palette.primary.dark } // optional hover color
                  }}
                >
                  Proceed &gt;
                </Button>
              </Box>

              <Box mt={3} textAlign="center">
                <Typography
                  component={Link}
                  to="/login"
                  variant="subtitle1"
                  sx={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    color: theme.palette.text.secondary
                  }}
                >
                  Go Back to <span style={{ color: theme.palette.background.theme, fontWeight: 500 }}>Login</span>
                </Typography>
              </Box>
            </Box>
          )} */}

          {/* Step 1 - Registration form */}
          {step === 1 && (
            <>
              {selectedRole === 'Law Firm' ? (
                <PCMSignUp onChange={handleUserDetailChange} handleNext={handleNext} initialValues={userData} selectedRole={selectedRole} />
              ) : (
                <UserDetail
                  onChange={handleUserDetailChange}
                  handleNext={handleNext}
                  initialValues={userData}
                  selectedRole={selectedRole}
                />
              )}

              <Box textAlign="center" mt={2}>
                <Typography
                  component={Link}
                  to="/login"
                  variant="subtitle1"
                  sx={{
                    ...style.signUp,
                    fontSize: '14px',
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  Go Back to&nbsp;
                  <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>Login</span>
                </Typography>
              </Box>
            </>
          )}

          {/* Step 2 - Terms & Conditions */}
          {step === 2 && (
            <>
             
            </>
          )}
        </Grid>

        {/* Contact */}
        <Box sx={style.contactBox} textAlign="center" mt={2}>
          <Typography sx={{ mb: 1 }}>
            <IconPhoneFilled size={15} /> Need help
          </Typography>
          <Typography sx={{ ml: 2 }}>+91 9594364935</Typography>
        </Box>
      </Grid>
    </div>
  );
};

export default AuthRegister;

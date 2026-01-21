import { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  ButtonBase
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import { useDispatch, useSelector } from 'react-redux';
import { userLogin, selectError } from 'container/LoginContainer/slice';
import { CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ==============================|| RETAIL OS LOGIN ||============================== //

const RoleButton = ({ role, icon: Icon, selected, onClick }) => (
  <ButtonBase
    onClick={() => onClick(role)}
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      py: 1.5,
      borderRadius: 2,
      backgroundColor: selected ? '#fff' : 'transparent',
      boxShadow: selected ? '0px 2px 4px rgba(0,0,0,0.05)' : 'none',
      color: selected ? 'primary.main' : 'text.secondary',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: selected ? '#fff' : 'rgba(0,0,0,0.02)',
      }
    }}
  >
    <Icon fontSize="small" />
    <Typography variant="body2" fontWeight={500}>
      {role}
    </Typography>
  </ButtonBase>
);

const KeypadButton = ({ value, onClick, isAction, ...other }) => (
  <ButtonBase
    onClick={onClick}
    {...other}
    sx={{
      width: '100%',
      height: 56,
      borderRadius: 1.5,
      backgroundColor: isAction === 'submit' ? 'primary.main' : '#fff',
      color: isAction === 'submit' ? '#fff' : 'text.primary',
      border: isAction ? 'none' : '1px solid',
      borderColor: 'divider',
      fontSize: '20px',
      fontWeight: 500,
      transition: 'all 0.1s',
      '&:active': {
        transform: 'scale(0.98)',
        backgroundColor: isAction === 'submit' ? 'primary.dark' : 'grey.100'
      },
      '&:hover': {
        backgroundColor: isAction === 'submit' ? 'primary.dark' : 'grey.50'
      },
      ...other.sx
    }}
  >
    {value}
  </ButtonBase>
);

const LoginRetailOS = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.login);
  const error = useSelector(selectError);

  const [role, setRole] = useState('Cashier');
  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (token && user) {
      const path = user.role === 'TenantAdmin' ? '/admin/dashboard' : '/pos/dashboard';
      navigate(path);
    }
  }, [navigate]);

  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Keypad handling
  const handleKeypadClick = (value) => {
    if (value === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
    } else if (value === 'submit') {
      handleSubmit();
    } else {
      if (pin.length < 6) {
        setPin((prev) => prev + value);
      }
    }
  };

  const handleSubmit = () => {
    // Mapping ID/PIN to Email/Password for backend compatibility
    const payload = {
      email: employeeId,
      password: pin,
      navigate: navigate
    };
    dispatch(userLogin(payload));
  };

  const handleDemoLogin = (userRole, path) => {
    localStorage.clear();
    const name = userRole === 'TenantAdmin' ? 'Admin Demo' : userRole === 'Manager' ? 'Manager Demo' : 'Cashier Demo';
    localStorage.setItem('user', JSON.stringify({ role: userRole, name }));
    localStorage.setItem('token', 'mock-token');
    window.location.replace(path);
  };

  return (
    <Grid container sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Image & Branding */}
      <Grid
        size={{ md: 5, lg: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          backgroundColor: 'dark.900', // Use theme dark paper
          backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop)', // Retail store background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <StorefrontIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h3" color="white" fontWeight={700}>
            RetailOS
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <Typography variant="h2" color="white" fontWeight={700} sx={{ mb: 2, fontSize: '2.5rem' }}>
            Streamline your store operations.
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 1, lineHeight: 1.6 }}>
            Secure, fast, and reliable point of sale access for your entire team.
            System status: <Box component="span" sx={{ color: '#4caf50', fontWeight: 'bold' }}>● Online</Box>
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid
        size={{ xs: 12, md: 7, lg: 6 }}
        sx={{
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4, md: 6 },
          minHeight: '100vh',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please enter your details to sign in.
            </Typography>
          </Box>

{/* 
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Select Role
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 0.5,
                bgcolor: 'rgba(0,0,0,0.03)',
                borderRadius: 2.5,
                display: 'flex',
                gap: 0.5
              }}
            >
              <RoleButton
                role="Cashier"
                icon={StorefrontIcon}
                selected={role === 'Cashier'}
                onClick={setRole}
              />
              <RoleButton
                role="Manager"
                icon={BusinessCenterIcon}
                selected={role === 'Manager'}
                onClick={setRole}
              />
              <RoleButton
                role="Admin"
                icon={AdminPanelSettingsIcon}
                selected={role === 'Admin'}
                onClick={setRole}
              />
            </Paper>
          </Box>
*/}

          {/* Form Fields */}
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                Employee ID
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                  }
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  PIN Code
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'primary.main', 
                    cursor: 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  Forgot PIN?
                </Typography>
              </Box>
              <TextField
                fullWidth
                type={showPin ? 'text' : 'password'}
                placeholder="••••"
                value={pin}
                disabled // Input driven by keypad primarily, though we could allow typing
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPin(!showPin)} edge="end" size="small">
                        {showPin ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                    letterSpacing: '4px',
                    fontWeight: 'bold'
                  }
                }}
              />
            </Box>
          </Stack>

          {/* Keypad */}
          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Grid size={{ xs: 4 }} key={num}>
                <KeypadButton value={num} onClick={() => handleKeypadClick(num.toString())} />
              </Grid>
            ))}
            <Grid size={{ xs: 4 }}>
              <KeypadButton 
                value={<BackspaceOutlinedIcon fontSize="small" />} 
                onClick={() => handleKeypadClick('backspace')}
                isAction="backspace" 
                sx={{ bgcolor: 'rgba(0,0,0,0.03) !important', border: 'none !important' }} // Custom visual for backspace if needed, overriding default
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <KeypadButton value={0} onClick={() => handleKeypadClick('0')} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <KeypadButton 
                value={<CheckIcon />} 
                onClick={() => handleKeypadClick('submit')} 
                isAction="submit" 
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error.message || 'Login failed. Please check your credentials.'}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {loading ? 'Authenticating...' : 'Access Terminal'}
          </Button>

          {/* Demo Login Options */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, mb: 1, display: 'block', textAlign: 'center' }}>
              ENVIRONMENT DEMO ACCESS
            </Typography>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleDemoLogin('TenantAdmin', '/admin/dashboard')}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderStyle: 'dashed',
                  color: 'primary.main',
                  '&:hover': { borderStyle: 'dashed', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                }}
              >
                Demo Login (Admin)
              </Button>
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleDemoLogin('Manager', '/pos/dashboard')}
                  startIcon={<BusinessCenterIcon />}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderStyle: 'dashed',
                    color: 'success.main',
                    borderColor: 'success.light',
                    '&:hover': { borderStyle: 'dashed', bgcolor: alpha(theme.palette.success.main, 0.05), borderColor: 'success.main' }
                  }}
                >
                  Manager
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleDemoLogin('Cashier', '/pos/dashboard')}
                  startIcon={<StorefrontIcon />}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderStyle: 'dashed',
                    color: 'info.main',
                    borderColor: 'info.light',
                    '&:hover': { borderStyle: 'dashed', bgcolor: alpha(theme.palette.info.main, 0.05), borderColor: 'info.main' }
                  }}
                >
                  Cashier
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Footer help */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              <HelpOutlineIcon fontSize="small" />
              <Typography variant="caption" fontWeight={500}>Help Center</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              <SupportAgentIcon fontSize="small" />
              <Typography variant="caption" fontWeight={500}>Contact Support</Typography>
            </Box>
          </Box>
          
          <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3, color: 'text.disabled' }}>
            © 2023 RetailOS Inc. v2.4.1
          </Typography>

        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginRetailOS;

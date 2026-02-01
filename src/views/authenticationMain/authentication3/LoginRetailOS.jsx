import { useState, useEffect } from 'react';
import { tokenManager } from 'utils/tokenManager';
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
  ButtonBase,
  CircularProgress,
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import { useDispatch, useSelector } from 'react-redux';
import { userLogin, selectError } from 'container/LoginContainer/slice';
import { useNavigate } from 'react-router-dom';
import config from 'config';

// ==============================|| RETAIL OS LOGIN ||============================== //



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




  // Redirect if already logged in
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (token && user) {
      const path = ['SUPER_ADMIN', 'ADMIN'].includes(user.role) 
        ? '/admin/dashboard' 
        : '/pos/dashboard';
      navigate(path);
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // System Health Check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(config.health);
        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Keypad handling
  const handleKeypadClick = (value) => {
    if (value === 'backspace') {
      setPassword((prev) => prev.slice(0, -1));
    } else if (value === 'submit') {
      handleSubmit();
    } else {
      if (password.length < 20) {
        setPassword((prev) => prev + value);
      }
    }
  };

  const handleSubmit = () => {
    // Mapping Email/Password for backend compatibility
    const payload = {
      email: email,
      password: password,
      navigate: navigate
    };
    dispatch(userLogin(payload));
  };



  return (
    <Grid container sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Image & Branding */}
      <Grid
        size={{ md: 5, lg: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          backgroundColor: '#111827', // Dark slate background
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
            System status: <Box component="span" sx={{ color: isOnline ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>● {isOnline ? 'Online' : 'Offline'}</Box>
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
            <Typography variant="h1" fontWeight={800} gutterBottom sx={{ color: 'text.primary', fontSize: '2.125rem' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please enter your details to sign in.
            </Typography>
          </Box>

          {/* Form Fields */}
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Password
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>
              <TextField
                fullWidth
                type={showPin ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  )
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
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error.message || 'Login failed. Please check your credentials.'}
            </Alert>
          )}

          {/* Submit Button */}
{/* <Button
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
              mb: 4
            }}
          >
            {loading ? 'Authenticating...' : 'Access Terminal'}
          </Button> */}


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
                sx={{ bgcolor: 'rgba(0,0,0,0.03) !important', border: 'none !important' }}
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
            © 2026 RetailOS Inc. v2.4.1
          </Typography>

        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginRetailOS;

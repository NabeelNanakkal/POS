import { Outlet, NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Fab,
  Dialog,
  Button
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';
import { useGetMenuMaster, handlerDrawerOpen } from 'api/menu';
import { useDispatch } from 'react-redux';
import { openShift, closeShift, fetchCurrentShift } from 'container/ShiftContainer/slice';
import ShiftStartModal from 'views/cashier/ShiftStartModal';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';

import { TextField, InputAdornment, Tooltip } from '@mui/material';
import axios from 'axios';
import config from 'config';

// Icons
import GridViewIcon from '@mui/icons-material/GridView';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 260;
const miniDrawerWidth = 80;

import menuItems from 'menu-items';
import { tokenManager } from 'utils/tokenManager';
import { filterRoutesByRole } from 'utils/filterRoutesByRole';

const PosLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const { menuMaster } = useGetMenuMaster();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'Cashier';
  const dispatch = useDispatch();
  
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [shiftEndDialogOpen, setShiftEndDialogOpen] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);

  const [activeShift, setActiveShift] = useState(null);

  const isCashier = userRole.toUpperCase() === 'CASHIER';

  useEffect(() => {
    const checkShift = async () => {
      if (isCashier) {
        try {
          const res = await axios.get(`${config.ip}/shifts/current`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          });
          if (res.data.success && res.data.data) {
            setActiveShift(res.data.data);

            localStorage.setItem('isShiftOpen', 'true');
          } else {
            setShowShiftModal(true);
            localStorage.setItem('isShiftOpen', 'false');
          }
        } catch (err) {
          console.error('Failed to check shift status', err);
        }
      }
    };
    checkShift();
  }, [isCashier]);

  const handleShiftStart = (balance) => {
    const now = new Date();
    const shiftData = {
      startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startDate: now.toLocaleDateString(),
      openingBalance: balance,
      user: user?.name || 'Cashier',
      shiftId: `#SH-${now.getTime()}`,
      itemsSold: 0
    };

    localStorage.setItem('isShiftOpen', 'true');
    localStorage.setItem('shiftData', JSON.stringify(shiftData));
    dispatch(openShift({ openingBalance: balance }));
    setShowShiftModal(false);
  };

  // Get dynamic menu items filtered by role
  const filteredMenu = useMemo(() => {
    // menuItems is an array (from menu-items/index.js), we take the first group 'main'
    const mainGroup = menuItems[0];
    return filterRoutesByRole([mainGroup], userRole)[0]?.children || [];
  }, [userRole]);

  // drawerOpen is true when expanded, false when collapsed/closed
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const sidebarCollapsed = !drawerOpen;
  
  const currentWidth = sidebarCollapsed ? miniDrawerWidth : drawerWidth;

  const handleLogoutClick = () => {
    if (isCashier && localStorage.getItem('isShiftOpen') === 'true') {
      setShiftEndDialogOpen(true);
    } else {
      setLogoutDialogOpen(true);
    }
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    if (isCashier && localStorage.getItem('isShiftOpen') === 'true') {
      setShiftEndDialogOpen(true);
    } else {
      performLogout();
    }
  };

  const performLogout = () => {
    tokenManager.clearTokens();
    localStorage.removeItem('user');
    localStorage.removeItem('isShiftOpen');
    localStorage.removeItem('shiftData');
    window.location.replace('/login');
  };

  const handleShiftEndLogout = () => {
    localStorage.removeItem('isShiftOpen');
    localStorage.removeItem('shiftData');
    
    dispatch(closeShift({ 
      notes: `Shift closed automatically at logout.`
    }));
    
    performLogout();
  };

  const handleJustLogout = () => {
    performLogout();
  };



  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
      
      {/* Sidebar */}
      <Drawer
        sx={{
          width: currentWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter,
            }),
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflowX: 'hidden'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Unified Sidebar Header - FIXED TOP */}
        <Box
          sx={{
            height: 90,
            display: 'flex',
            alignItems: 'center',
            pt: 2,
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            px: sidebarCollapsed ? 0 : 2,
            bgcolor: sidebarCollapsed ? 'primary.main' : 'transparent',
            color: sidebarCollapsed ? 'white' : 'primary.main',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderBottom: sidebarCollapsed ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
            flexShrink: 0,
            '&:hover': {
              bgcolor: sidebarCollapsed ? 'primary.dark' : alpha(theme.palette.primary.main, 0.02)
            }
          }}
          onClick={() => !sidebarCollapsed && handlerDrawerOpen(false)}
        >
          {/* Logo Section (Only visible when expanded) */}
          {!sidebarCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <StorefrontIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2 }}>Retail POS</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mt: -0.2 }}>Downtown Branch</Typography>
              </Box>
            </Box>
          )}

          {/* Toggle Icon */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlerDrawerOpen(!drawerOpen);
            }}
            sx={{ 
                color: 'inherit',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Dynamic Menu Items - SCROLLABLE MIDDLE */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          px: 2, 
          pt: 4,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
        }}>
          <List sx={{ p: 0 }}>
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.url;
              const Icon = item.icon;
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
                  <ListItemButton
                    component={RouterLink}
                    to={item.url}
                    sx={{
                      borderRadius: 4,
                      py: 1.5,
                      px: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 4,
                        bgcolor: 'primary.main',
                        borderRadius: '0 4px 4px 0',
                        transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover': {
                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.04),
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                        '& .MuiListItemIcon-root': {
                          transform: 'scale(1.1) rotate(-5deg)',
                          color: 'primary.main'
                        }
                      }
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive ? 'primary.main' : 'inherit', 
                        minWidth: sidebarCollapsed ? 0 : 42,
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon sx={{ fontSize: 22 }} />
                    </ListItemIcon>
                    {!sidebarCollapsed && (
                      <ListItemText 
                        primary={item.title} 
                        primaryTypographyProps={{ 
                          fontWeight: isActive ? 800 : 600,
                          fontSize: '0.9rem',
                          letterSpacing: 0.2
                        }} 
                      />
                    )}
                    {isActive && (
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main',
                          boxShadow: `0 0 10px ${theme.palette.primary.main}`
                        }} 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* User Profile Section - FIXED BOTTOM */}
        <Box sx={{ mt: 'auto', p: 2, flexShrink: 0 }}>
          <Divider sx={{ mb: 2, opacity: 0.5 }} />
          <Box 
            sx={{ 
                p: 1.5, 
                borderRadius: 4, 
                bgcolor: 'rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
            }}
          >
            <Avatar 
              sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {(user.username || user.name) ? (user.username || user.name).split(/[\s_]+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() : 'U'}
            </Avatar>
            {!sidebarCollapsed && (
              <>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={800} noWrap sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                    {user.username || user.name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', lineHeight: 1.2 }}>
                    ID: {user.employeeId || (user.id || user._id || '0000').slice(-4).toUpperCase()}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ display: 'block', color: 'primary.main', fontSize: '0.65rem', mt: 0.3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {userRole}
                  </Typography>
                </Box>
                


                <IconButton 
                  size="small" 
                  onClick={handleLogoutClick}
                  sx={{ 
                      color: 'error.main', 
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
                      transition: 'all 0.2s ease'
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: `calc(100% - ${currentWidth}px)`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        
        {/* Page Content */}
        <Outlet context={{ handlerDrawerOpen, drawerOpen }} />

      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 320 } }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <LogoutIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={800} gutterBottom>Confirm Logout</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Are you sure you want to end your session?
            </Typography>
            <Stack direction="row" spacing={2}>
                <Button fullWidth onClick={() => setLogoutDialogOpen(false)} sx={{ fontWeight: 700, borderRadius: 2 }}>
                    Cancel
                </Button>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="error" 
                    onClick={handleLogoutConfirm}
                    sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 'none' }}
                >
                    Logout
                </Button>
            </Stack>
        </Box>
      </Dialog>

      <ShiftStartModal 
        open={showShiftModal} 
        onConfirm={handleShiftStart}
        loading={false}
      />

      <Dialog
        open={shiftEndDialogOpen}
        onClose={() => setShiftEndDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
              <LockClockOutlinedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>Shift End Options</Typography>
              <Typography variant="caption" color="text.secondary">Ahmed, please choose an action</Typography>
            </Box>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Would you like to end your active shift before logging out, or just logout and keep the shift open?
          </Typography>
          
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleShiftEndLogout}
              startIcon={<LockClockOutlinedIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              End Shift & Logout
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleJustLogout}
              startIcon={<LogoutIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              Logout (Keep Shift Open)
            </Button>
            <Button 
              fullWidth 
              onClick={() => setShiftEndDialogOpen(false)}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PosLayout;

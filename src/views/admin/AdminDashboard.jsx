import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import AddHomeIcon from '@mui/icons-material/AddHome';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

// Components
import RevenueChart from 'views/cashier/components/RevenueChart';
import { fetchStores } from 'container/StoreContainer/slice';
import { fetchEmployees } from 'container/EmployeeContainer/slice';
import { getCardCounts } from 'container/dashBoardContainer/slice';
import NoDataLottie from 'ui-component/NoDataLottie';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 4,
        border: '1px solid #eee',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
      }}
    >
      <Box
        sx={{
          width: { xs: 48, sm: 64 },
          height: { xs: 48, sm: 64 },
          borderRadius: 3,
          bgcolor: alpha(theme.palette[color].main, 0.1),
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon sx={{ fontSize: { xs: 28, sm: 35 } }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap gutterBottom>
          {title}
          </Typography>
          <Typography variant={{ xs: 'h3', sm: 'h2' }} fontWeight={800} sx={{ mb: 0.5 }}>
          {value}
          </Typography>
          {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                  <TrendingUpIcon fontSize="small" color={color} />
                  <Typography variant="caption" fontWeight={700} color={`${color}.main`}>{trend}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'inline' } }}>vs last month</Typography>
              </Stack>
          )}
      </Box>
    </Paper>
  );
};

const QuickActionCard = ({ title, subtitle, icon: Icon, color = 'primary', onClick }) => {
  const theme = useTheme();
  const mainColor = theme.palette[color].main;
  
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: { xs: 110, sm: 140 },
        width: '100%',
        bgcolor: 'white',
        color: 'text.secondary',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-8px)', 
          bgcolor: mainColor,
          color: 'white',
          borderColor: mainColor,
          boxShadow: `0 20px 40px ${alpha(mainColor, 0.25)}`,
          '& .MuiSvgIcon-root': {
            transform: 'scale(1.2) rotate(-5deg)',
            color: 'white'
          }
        }
      }}
    >
      <Icon sx={{ fontSize: { xs: 32, sm: 40 }, transition: 'all 0.3s ease', color: mainColor }} />
      <Box sx={{ textAlign: 'center', transition: 'all 0.3s ease' }}>
        <Typography 
          variant="subtitle1" 
          fontWeight={800} 
          align="center"
          sx={{ color: 'inherit', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
                display: 'block', 
                mt: -0.5, 
                opacity: 0.8,
                color: 'inherit',
                fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stores } = useSelector((state) => state.store);
  const { employees } = useSelector((state) => state.employee);
  const { cardCounts } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchEmployees());
    dispatch(getCardCounts());
  }, [dispatch]);

  // Real data from cardCounts
  const totalRevenue = cardCounts?.totalRevenue ? `$${Number(cardCounts.totalRevenue).toLocaleString()}` : "$0.00";
  const revenueTrend = cardCounts?.revenueTrend || "0%";
  const activeSessions = cardCounts?.activeSessions || "0";

  return (
    <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Stats Row */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4, 
          width: '100%' 
        }}
      >
        <StatCard 
          title="Total Revenue" 
          value={totalRevenue} 
          icon={AttachMoneyIcon} 
          color="success" 
          trend={revenueTrend} 
        />
        <StatCard 
          title="Total Stores" 
          value={stores.length.toString()} 
          icon={StorefrontIcon} 
          color="primary" 
        />
        <StatCard 
          title="Total Staff" 
          value={employees.length.toString()} 
          icon={GroupsIcon} 
          color="info" 
        />
        <StatCard 
          title="Active Sessions" 
          value={activeSessions} 
          icon={PeopleIcon} 
          color="warning" 
        />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Global Management</Typography>
        <Box 
            sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                gap: 2 
            }}
        >
            <QuickActionCard 
                title="Add New Store" 
                subtitle="Expand operations"
                icon={AddHomeIcon} 
                color="secondary"
                onClick={() => navigate('/admin/stores')}
            />
            <QuickActionCard 
                title="Hire Employee" 
                subtitle="Onboard staff"
                icon={PersonAddAlt1Icon} 
                color="success"
                onClick={() => navigate('/admin/employees')}
            />
            <QuickActionCard 
                title="Global Reports" 
                subtitle="Company metrics"
                icon={AssessmentOutlinedIcon} 
                color="info"
                onClick={() => navigate('/pos/reports')}
            />
            <QuickActionCard 
                title="Store Hub" 
                subtitle="Manage outlets"
                icon={StorefrontIcon} 
                color="primary"
                onClick={() => navigate('/admin/stores')}
            />
        </Box>
      </Box>

      {/* Content Grid */}
      <Box 
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr', xl: '9fr 3fr' }, 
            gap: 3,
            mb: 4,
            width: '100%'
        }}
      >
        {/* Left Col: Chart */}
        <Box sx={{ width: '100%', minHeight: { xs: 300, sm: 380 } }}>
          <RevenueChart />
        </Box>

        {/* Right Col: Store Performance */}
        <Box sx={{ height: '100%', width: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Store Performance</Typography>
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>STORE</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11 }}>REVENUE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stores?.length > 0 ? (
                    stores.map((store) => (
                      <TableRow key={store.id} hover>
                        <TableCell sx={{ py: 1.5 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main', fontSize: 12, fontWeight: 800 }}>
                              {store.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight={700} noWrap>{store.name}</Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>{store.code}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight={700}>$12,450</Typography>
                          <Chip size="small" label="+5%" color="success" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, borderRadius: 1 }} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 4 }}>
                        <NoDataLottie 
                          title="No Data"
                          message="No store performance records found."
                          size="150px"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate('/admin/stores')}>
              View All Stores
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

// Components
import RevenueChart from './components/RevenueChart';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2.5, sm: 3 },
      borderRadius: 4,
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
        bgcolor: `${color}.light`,
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
        <Typography variant={ { xs: 'h3', sm: 'h2' } } fontWeight={700} sx={{ mb: 0.5 }}>
        {value}
        </Typography>
        {trend && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon fontSize="small" color={color} />
                <Typography variant="caption" fontWeight={700} color={`${color}.main`}>{trend}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'inline' } }}>vs yesterday</Typography>
            </Stack>
        )}
    </Box>
  </Paper>
);

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
          },
          '& .MuiBox-root': {
            opacity: 1
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

const getCustomerColor = (name) => {
    const colors = [
        { bg: '#EEF2FF', text: '#4F46E5' }, // Indigo
        { bg: '#FDF2F8', text: '#DB2777' }, // Pink
        { bg: '#F0FDF4', text: '#16A34A' }, // Green
        { bg: '#FFF7ED', text: '#EA580C' }, // Orange
        { bg: '#FAF5FF', text: '#9333EA' }, // Purple
        { bg: '#ECFEFF', text: '#0891B2' }, // Cyan
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const TopProductRow = ({ name, sales, image }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar 
            variant="rounded" 
            src={image} 
            sx={{ width: 48, height: 48, bgcolor: 'primary.light', color: 'primary.main' }}
        >
            {name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>{name}</Typography>
            <Typography variant="caption" color="text.secondary">{sales} sold today</Typography>
        </Box>
        <Chip size="small" label="Top" color="warning" sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />
    </Box>
);

const MainDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [shiftData, setShiftData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role || 'Cashier';

  useEffect(() => {
    const savedStatus = localStorage.getItem('isShiftOpen') === 'true';
    const savedData = localStorage.getItem('shiftData');
    setIsShiftOpen(savedStatus);
    if (savedData) setShiftData(JSON.parse(savedData));
  }, []);

  const isAdmin = userRole === 'TenantAdmin';
  const isManager = userRole === 'Manager';
  const isCashier = userRole === 'Cashier';

  return (
    <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Overview Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3, 
          width: '100%' 
        }}
      >
        <Typography variant="h3" fontWeight={800} sx={{ display: { sm: 'none' } }}>Dashboard</Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> {/* Spacing placeholder */}
        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
           <Button 
             variant="outlined" 
             fullWidth={false}
             startIcon={<CalendarTodayOutlinedIcon />}
             sx={{ 
                flex: { xs: 1, sm: 'none' },
                bgcolor: 'white', 
                border: '1px solid', 
                borderColor: 'divider', 
                color: 'text.secondary', 
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
             }}
           >
             Oct 24, 2025
           </Button>
           <Button 
             variant="contained" 
             fullWidth={false}
             startIcon={<TuneOutlinedIcon />}
             sx={{ 
                flex: { xs: 1, sm: 'none' },
                borderRadius: 2, 
                boxShadow: 'none',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
             }}
           >
             Customize
           </Button>
        </Box>
      </Box>

      {/* Stats Row */}
      <Box 
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 3, 
            width: '100%' 
        }}
      >
        <StatCard 
          title="Total Revenue" 
          value="$1,240.50" 
          icon={AttachMoneyIcon} 
          color="success" 
          trend="+12%" 
        />
        <StatCard 
          title="Total Transactions" 
          value="45" 
          icon={ReceiptLongIcon} 
          color="primary" 
          trend="+5%" 
        />
        <StatCard 
          title="Total Customers" 
          value="3,200" 
          icon={StorefrontIcon} 
          color="info" 
          trend="+18%"
        />
        <StatCard 
          title="Active Products" 
          value="1,203" 
          icon={InventoryIcon} 
          color="warning" 
        />
      </Box>

      {/* Quick Actions Row */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Quick Access</Typography>
        <Box 
            sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                    xs: 'repeat(2, 1fr)', 
                    md: 'repeat(4, 1fr)' 
                }, 
                gap: { xs: 1.5, sm: 2 } 
            }}
        >
            {(isCashier || isManager || isAdmin) && (
                <QuickActionCard 
                    title="Terminal Checkout" 
                    subtitle={isShiftOpen ? `${shiftData?.itemsSold || 0} Items Sold This Shift` : "Opening shift required"}
                    icon={PointOfSaleIcon} 
                    color="secondary"
                    onClick={() => navigate('/pos/terminal')}
                />
            )}
            {(isCashier || isManager || isAdmin) && (
                <QuickActionCard 
                    title={isShiftOpen ? "End Shift" : "Start Shift"} 
                    subtitle={isShiftOpen ? `Started at ${shiftData?.startTime}` : "Click to check-in"}
                    icon={EventAvailableIcon} 
                    color={isShiftOpen ? "error" : "success"}
                    onClick={() => navigate('/pos/shift')}
                />
            )}
            {(isManager || isAdmin) && (
                <>
                    <QuickActionCard 
                        title="Inventory Hub" 
                        subtitle="Manage your stocks"
                        icon={Inventory2OutlinedIcon} 
                        color="info"
                        onClick={() => navigate('/pos/products')}
                    />
                    <QuickActionCard 
                        title="Business Insights" 
                        subtitle="View sales reports"
                        icon={AssessmentOutlinedIcon} 
                        color="primary"
                        onClick={() => navigate('/pos/reports')}
                    />
                </>
            )}
            {isAdmin && (
                <>
                    <QuickActionCard 
                        title="Store Management" 
                        subtitle="Manage locations"
                        icon={StorefrontIcon} 
                        color="warning"
                        onClick={() => navigate('/admin/stores')}
                    />
                    <QuickActionCard 
                        title="Employee Hub" 
                        subtitle="Staff & Permissions"
                        icon={InventoryIcon} 
                        color="secondary"
                        onClick={() => navigate('/admin/employees')}
                    />
                </>
            )}
        </Box>
      </Box>

      {/* Content Grid */}
      <Box 
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr', xl: '9fr 3fr' }, 
            gap: 3,
            mb: 4
        }}
      >
        {/* Left Col: Chart */}
        <Box sx={{ width: '100%', minHeight: { xs: 300, sm: 380 } }}>
            <RevenueChart />
        </Box>

        {/* Right Col: Top Products */}
        <Box sx={{ height: '100%', width: '100%' }}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Top Selling Items</Typography>
                
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TopProductRow name="Wireless Headphones" sales="24" />
                    <TopProductRow name="Smart Watch Gen 3" sales="18" />
                    <TopProductRow name="Bluetooth Speaker" sales="12" />
                    <TopProductRow name="Mechanical Keyboard" sales="10" />
                    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                        <TopProductRow name="USB-C Hub" sales="9" />
                        <TopProductRow name="Gaming Mouse" sales="8" />
                    </Box>
                </Box>

                <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => navigate('/pos/products')}
                    sx={{ mt: 2, borderRadius: 2 }}
                >
                    View All Products
                </Button>
            </Paper>
        </Box>
      </Box>

      {/* Recent Transactions Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>Recent Transactions</Typography>
        <Button 
            endIcon={<ArrowForwardIcon />} 
            onClick={() => navigate('/pos/reports')}
            sx={{ textTransform: 'none' }}
        >
            View All Orders
        </Button>
      </Box>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>ORDER ID</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', sm: 'table-cell' } }}>DATE & TIME</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>CUSTOMER</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', lg: 'table-cell' } }}>PAYMENT</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>AMOUNT</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { id: '#ORD-00245', time: 'Oct 24, 10:42 AM', customer: 'Walk-in Customer', payment: 'Cash', amount: '$42.50', status: 'Completed', color: 'success' },
                      { id: '#ORD-00244', time: 'Oct 24, 10:15 AM', customer: 'Sarah Miller', payment: 'Credit Card', amount: '$120.00', status: 'Completed', color: 'success' },
                      { id: '#ORD-00243', time: 'Oct 24, 09:55 AM', customer: 'Michael Johnson', payment: 'E-Wallet', amount: '$15.00', status: 'Pending', color: 'warning' },
                      { id: '#ORD-00242', time: 'Oct 24, 09:30 AM', customer: 'Walk-in', payment: 'Cash', amount: '$8.50', status: 'Completed', color: 'success' },
                      { id: '#ORD-00241', time: 'Oct 24, 09:12 AM', customer: 'James Smith', payment: 'Credit Card', amount: '$65.20', status: 'Refunded', color: 'error' },
                    ].map((row) => {
                      const custStyle = getCustomerColor(row.customer);
                      return (
                        <TableRow 
                          key={row.id} 
                          hover
                          sx={{ 
                            backgroundImage: `linear-gradient(to right, ${theme.palette.divider} 80%, rgba(255,255,255,0) 0%)`,
                            backgroundPosition: 'bottom',
                            backgroundSize: '12px 2px',
                            backgroundRepeat: 'repeat-x',
                            '&:last-of-type': { backgroundImage: 'none' },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: custStyle.text, py: 2.5 }}>{row.id}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.time}</TableCell>
                          <TableCell>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Avatar 
                                    sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        fontSize: 12, 
                                        fontWeight: 800,
                                        bgcolor: custStyle.bg, 
                                        color: custStyle.text,
                                        display: { xs: 'none', sm: 'flex' },
                                        border: '1px solid',
                                        borderColor: alpha(custStyle.text, 0.1)
                                    }}
                                  >
                                    {row.customer.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight={600}>{row.customer}</Typography>
                              </Stack>
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{row.payment}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{row.amount}</TableCell>
                          <TableCell>
                            <Chip 
                              size="small" 
                              label={row.status} 
                              color={row.color} 
                              variant="outlined"
                              sx={{ 
                                  fontWeight: 700,
                                  borderRadius: 1.5,
                                  border: '1px solid',
                                  borderColor: `${row.color}.main`,
                                  bgcolor: `${row.color}.lighter`,
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                              }} 
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

    </Box>
  );
};

export default MainDashboard;

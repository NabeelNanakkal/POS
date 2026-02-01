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
  TablePagination,
  Stack,
  Avatar,
  CircularProgress
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
import dayjs from 'dayjs';

// Components
import RevenueChart from './components/RevenueChart';
import NoDataLottie from 'ui-component/NoDataLottie';

// Services
import orderService from 'services/orderService';
import dashboardService from 'services/dashboardService';

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
  const userRole = (user?.role || 'CASHIER').toUpperCase();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalCustomers: 0,
    activeProducts: 0,
    revenueTrend: '+0%',
    transactionsTrend: '+0%',
    customersTrend: '+0%',
    productsTrend: 'Stable'
  });
  const rowsPerPage = 5;

  useEffect(() => {
    const savedStatus = localStorage.getItem('isShiftOpen') === 'true';
    const savedData = localStorage.getItem('shiftData');
    setIsShiftOpen(savedStatus);
    if (savedData) setShiftData(JSON.parse(savedData));
    
    loadOrders();
    loadTopProducts();
    loadStats();
  }, [page]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders({ 
        page: page + 1, 
        limit: rowsPerPage,
        store: user?.store?._id || user?.store
      });
      if (response.data) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      const response = await orderService.getTopSellingItems({
        store: user?.store?._id || user?.store
      });
      if (response.data) {
        setTopProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading top products:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats({
        store: user?.store?._id || user?.store
      });
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isAdmin = userRole === 'TENANTADMIN';
  const isManager = userRole === 'MANAGER';
  const isCashier = userRole === 'CASHIER';

  return (
    <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, pt: 1, pb: 3 }}>
      {/* Overview Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 1.5, 
          width: '100%' 
        }}
      >
        <Typography variant="h3" fontWeight={800} sx={{ display: { sm: 'none' } }}>Dashboard</Typography>
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
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={AttachMoneyIcon} 
          color="success" 
          trend={stats.revenueTrend} 
        />
        <StatCard 
          title="Total Transactions" 
          value={stats.totalTransactions.toString()} 
          icon={ReceiptLongIcon} 
          color="primary" 
          trend={stats.transactionsTrend} 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          icon={TrendingUpIcon} 
          color="info" 
          trend={stats.customersTrend} 
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts.toLocaleString()} 
          icon={Inventory2OutlinedIcon} 
          color="warning" 
          trend={stats.productsTrend} 
        />
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
                    {topProducts.length > 0 ? (
                      topProducts.map((product) => (
                        <TopProductRow 
                          key={product._id}
                          name={product.name} 
                          sales={`${product.totalSold} sold this week`} 
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No items sold this week
                      </Typography>
                    )}
                </Box>

                {!isCashier && (
                  <Button 
                      fullWidth 
                      variant="outlined" 
                      onClick={() => navigate('/pos/products')}
                      sx={{ mt: 2, borderRadius: 2 }}
                  >
                      View All Products
                  </Button>
                )}
            </Paper>
        </Box>
      </Box>

      {/* Recent Transactions Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>Recent Transactions</Typography>
      </Box>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>ORDER ID</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', sm: 'table-cell' } }}>DATE & TIME</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>CUSTOMER</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>TOTAL</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', lg: 'table-cell' } }}>CASH</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', lg: 'table-cell' } }}>CARD</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11, display: { xs: 'none', lg: 'table-cell' } }}>DIGITAL</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Loading transactions...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                          <NoDataLottie message="No transactions found" size="150px" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((row) => {
                        const customerName = row.customer?.name || 'Walk-in Customer';
                        const custStyle = getCustomerColor(customerName);
                        
                        // Extract payment parts
                        const cashAmount = row.payments?.find(p => p.method === 'CASH')?.amount;
                        const cardAmount = row.payments?.find(p => p.method === 'CARD')?.amount;
                        const digitalAmount = row.payments?.find(p => p.method === 'DIGITAL')?.amount;

                        return (
                          <TableRow 
                            key={row._id} 
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
                            <TableCell sx={{ fontWeight: 700, color: custStyle.text, py: 2.5 }}>{row.orderNumber}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                              {dayjs(row.createdAt).format('MMM D, h:mm A')}
                            </TableCell>
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
                                      {customerName.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight={600}>{customerName}</Typography>
                                </Stack>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>${row.total?.toFixed(2)}</TableCell>
                            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                              {cashAmount ? `$${cashAmount.toFixed(2)}` : '$0.00'}
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                              {cardAmount ? `$${cardAmount.toFixed(2)}` : '$0.00'}
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                              {digitalAmount ? `$${digitalAmount.toFixed(2)}` : '$0.00'}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={row.status} 
                                color={row.status === 'COMPLETED' ? 'success' : (row.status === 'PENDING' ? 'warning' : 'error')} 
                                variant="outlined"
                                sx={{ 
                                    fontWeight: 700,
                                    borderRadius: 1.5,
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                }} 
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={totalOrders}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              />
            </Paper>

    </Box>
  );
};

export default MainDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
// Icons
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import PaidIcon from '@mui/icons-material/Paid';
import dayjs from 'dayjs';

// Components
import RevenueChart from './components/RevenueChart';
import NoDataLottie from 'ui-component/NoDataLottie';

// Services
import orderService from 'services/orderService';
import dashboardService from 'services/dashboardService';
import storeService from 'services/storeService';

import { formatAmountWithComma, getCurrencySymbol } from 'utils/formatAmount';

// Helper for Simple Table (Manager/Cashier)
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
  
  // User & Auth
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = (user?.role || 'CASHIER').toUpperCase();
  // Include STORE_ADMIN regarding role checks
  const isAdmin = userRole === 'TENANTADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'STORE_ADMIN'; 
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isCashier = userRole === 'CASHIER';

  // State
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  // Modal state
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (trx) => {
    setSelectedTrx(trx);
    setIsModalOpen(true);
  };

  // Filters (Available for Admins)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [stores, setStores] = useState([]);

  // Initial Load
  useEffect(() => {
    loadTopProducts();
    loadStats();
    if (isSuperAdmin) {
        loadStores();
    }
  }, []);

  // Fetch Orders on interaction
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, searchTerm, selectedStore]);

  const loadStores = async () => {
    try {
        const response = await storeService.getStores();
        if (response.data) {
            setStores(response.data);
        }
    } catch (error) {
        console.error('Error loading stores:', error);
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        store: isSuperAdmin && selectedStore !== 'all' ? selectedStore : (user?.store?._id || user?.store)
      };

      const response = await orderService.getOrders(params);
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
          value={formatAmountWithComma(stats.totalRevenue)} 
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
                      <NoDataLottie message="No items sold this week" size="140px" />
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

      {/* Recent Transactions Section */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
              <Typography variant="h4" fontWeight={700}>Recent Transactions</Typography>
          </Box>
          
          {/* Admin Filters: Search & Store Select */}
          {isAdmin && (
            <Stack direction="row" spacing={2} alignItems="center">
                {isSuperAdmin && (
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="store-select-label">Store</InputLabel>
                        <Select
                            labelId="store-select-label"
                            label="Store"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            sx={{ borderRadius: 3, bgcolor: 'white' }}
                        >
                            <MenuItem value="all">All Stores</MenuItem>
                            {stores.map((store) => (
                                <MenuItem key={store._id} value={store._id}>{store.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <TextField 
                    placeholder="Search ID..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: 'white', '& fieldset': { borderColor: '#e2e8f0' } }
                    }}
                    sx={{ width: 200 }}
                />
            </Stack>
          )}
      </Box>

      {/* Unified Simple Table for Everyone (Cashier, Manager, Admin) */}
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
                      onClick={() => handleRowClick(row)}
                      sx={{ 
                        cursor: 'pointer',
                        backgroundImage: `linear-gradient(to right, ${theme.palette.divider} 80%, rgba(255,255,255,0) 0%)`,
                        backgroundPosition: 'bottom',
                        backgroundSize: '12px 2px',
                        backgroundRepeat: 'repeat-x',
                        '&:last-of-type': { backgroundImage: 'none' },
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={700} sx={{ color: custStyle.text }}>
                            {row.orderNumber}
                          </Typography>
                          {row.items?.some(item => item.isPriceOverridden) && (
                            <Chip 
                                label="Price Adjusted" 
                                size="small" 
                                sx={{ 
                                    height: 18, 
                                    fontSize: '0.65rem', 
                                    fontWeight: 800,
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    color: 'error.main',
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.error.main, 0.2)
                                }} 
                            />
                          )}
                        </Stack>
                      </TableCell>
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
                      <TableCell sx={{ fontWeight: 700 }}>{formatAmountWithComma(row.total)}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                        {cashAmount ? formatAmountWithComma(cashAmount) : `${getCurrencySymbol()} 0.00`}
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                        {cardAmount ? formatAmountWithComma(cardAmount) : `${getCurrencySymbol()} 0.00`}
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary', fontSize: '0.8rem' }}>
                        {digitalAmount ? formatAmountWithComma(digitalAmount) : `${getCurrencySymbol()} 0.00`}
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

      {/* Transaction Detail Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setIsModalOpen(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        {selectedTrx && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" fontWeight={900}>{selectedTrx.orderNumber}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {dayjs(selectedTrx.createdAt).format('MMMM DD, YYYY • hh:mm A')}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedTrx.status} 
                  size="small"
                  color={selectedTrx.status === 'COMPLETED' ? 'success' : 'error'}
                  sx={{ fontWeight: 800, borderRadius: 1.5 }}
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>CUSTOMER</Typography>
                    <Typography variant="body2" fontWeight={800}>{selectedTrx.customer?.name || 'Walk-in Customer'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>PAYMENT MODES</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                      {selectedTrx.payments?.map((pm, idx) => (
                        <Chip 
                          key={idx}
                          label={`${pm.method}: ${formatAmountWithComma(pm.amount)}`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontWeight: 800, 
                            height: 24, 
                            fontSize: '0.7rem',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            color: 'primary.dark'
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Typography variant="h5" fontWeight={800} sx={{ mb: 2, px: 1 }}>Items Summary</Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {selectedTrx.items?.map((item, idx) => (
                  <Box key={idx} sx={{ px: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={800}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          Qty: {item.quantity} × {formatAmountWithComma(item.price)}
                        </Typography>
                        {item.isPriceOverridden && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label={`Price Override: ${formatAmountWithComma(item.originalPrice)} → ${formatAmountWithComma(item.price)}`}
                              size="small"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.65rem', 
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                color: 'error.main',
                                border: '1px dashed',
                                borderColor: 'error.light'
                              }}
                            />
                          </Box>
                        )}
                        {item.discount > 0 && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label={`Item Discount: -${formatAmountWithComma(item.discount)}`}
                              size="small"
                              color="success"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.65rem', 
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                border: '1px dashed'
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight={900}>
                        {formatAmountWithComma(item.subtotal)}
                      </Typography>
                    </Box>
                    {idx < selectedTrx.items.length - 1 && <Divider sx={{ mt: 1.5, opacity: 0.5 }} />}
                  </Box>
                ))}
              </Stack>

              <Box sx={{ p: 2, bgcolor: '#1e293b', color: 'white', borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.85)' }}>Subtotal</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>{formatAmountWithComma(selectedTrx.subtotal || (selectedTrx.total / 1.08))}</Typography>
                  </Box>
                  {selectedTrx.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#4ade80' }}>
                           Discount
                        </Typography>
                        {selectedTrx.discountDetails && (
                            <Typography variant="caption" sx={{ color: '#4ade80', opacity: 0.8, display: 'block', mt: -0.5 }}>
                                {selectedTrx.discountDetails.code || selectedTrx.discountDetails.name} 
                                {selectedTrx.discountDetails.type === 'PERCENTAGE' ? ` (${selectedTrx.discountDetails.value}%)` : ''}
                            </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#4ade80' }}>-{formatAmountWithComma(selectedTrx.discount)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.85)' }}>Tax</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>{formatAmountWithComma(selectedTrx.tax || (selectedTrx.total - (selectedTrx.total / 1.08)))}</Typography>
                  </Box>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.15)', my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: 'white' }}>Grand Total</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ color: 'white' }}>{formatAmountWithComma(selectedTrx.total)}</Typography>
                  </Box>
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => setIsModalOpen(false)}
                sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', fontSize: '1rem' }}
              >
                Close Summary
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};

export default MainDashboard;

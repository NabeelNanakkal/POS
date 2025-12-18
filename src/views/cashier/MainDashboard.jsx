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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import LockClockIcon from '@mui/icons-material/LockClock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Components
import RevenueChart from './components/RevenueChart';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: 3,
        bgcolor: `${color}.light`,
        color: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon fontSize="large" />
    </Box>
    <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
        </Typography>
        <Typography variant="h2" fontWeight={700} sx={{ mb: 0.5 }}>
        {value}
        </Typography>
        {trend && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon fontSize="small" color={color} />
                <Typography variant="caption" fontWeight={700} color={`${color}.main`}>{trend} vs yesterday</Typography>
            </Stack>
        )}
    </Box>
  </Paper>
);

const QuickActionCard = ({ title, icon: Icon, color, onClick }) => (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={(theme) => ({
        p: 2.5,
        borderRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: 140,
        width: '100%',
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          borderColor: 'transparent'
        },
        ...(color === 'primary' && {
            bgcolor: 'primary.main',
            color: 'white',
            borderColor: 'primary.main',
            '&:hover': {
                 bgcolor: 'primary.dark',
                 boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`
            }
        })
      })}
    >
      <Icon sx={{ fontSize: 32, opacity: color === 'primary' ? 1 : 0.7 }} />
      <Typography variant="subtitle2" fontWeight={700} align="center">
        {title}
      </Typography>
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Overview Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: '100%' }}>
        <Box /> {/* Spacing placeholder */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
           <Button 
             variant="outlined" 
             startIcon={<CalendarTodayOutlinedIcon />}
             sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
           >
             Oct 24, 2025
           </Button>
           <Button 
             variant="contained" 
             startIcon={<TuneOutlinedIcon />}
             sx={{ borderRadius: 2, boxShadow: 'none' }}
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Quick Access</Typography>
        <Box 
            sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                gap: 2 
            }}
        >
            <QuickActionCard 
                title="New Sale" 
                icon={AddShoppingCartIcon} 
                color="primary"
                onClick={() => navigate('/pos/terminal')}
            />
            <QuickActionCard 
                title="Low Stock (3)" 
                icon={WarningAmberIcon} 
            />
            <QuickActionCard 
                title="Refunds" 
                icon={RestorePageIcon} 
            />
            <QuickActionCard 
                title="End Shift" 
                icon={LockClockIcon} 
            />
        </Box>
      </Box>

      {/* Content Grid */}
      {/* Content Grid */}
      <Box 
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '7fr 3fr' }, 
            gap: 2,
            mb: 3
        }}
      >
        {/* Left Col: Chart (70%) */}
        <Box sx={{ width: '100%' }}>
            <RevenueChart />
        </Box>

        {/* Right Col: Top Products (30%) */}
        <Box sx={{ height: '100%', width: '100%' }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Top Selling Items</Typography>
                
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TopProductRow name="Wireless Headphones" sales="24" />
                    <TopProductRow name="Smart Watch Gen 3" sales="18" />
                    <TopProductRow name="Bluetooth Speaker" sales="12" />
                    <TopProductRow name="Mechanical Keyboard" sales="10" />
                    <TopProductRow name="USB-C Hub" sales="9" />
                    <TopProductRow name="Gaming Mouse" sales="8" />
                    <TopProductRow name="Laptop Stand" sales="7" />
                    <TopProductRow name="Webcam HD" sales="6" />
                </Box>

                <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>View All Products</Button>
            </Paper>
        </Box>
      </Box>

      {/* Recent Transactions Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>Recent Transactions</Typography>
        <Button endIcon={<ArrowForwardIcon />} sx={{ textTransform: 'none' }}>View All Orders</Button>
      </Box>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>ORDER ID</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>DATE & TIME</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>CUSTOMER</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 11 }}>PAYMENT</TableCell>
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
                    ].map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{row.id}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{row.customer.charAt(0)}</Avatar>
                                <Typography variant="body2">{row.customer}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>{row.payment}</TableCell>
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
                                bgcolor: `${row.color}.lighter`
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

    </Box>
  );
};

export default MainDashboard;

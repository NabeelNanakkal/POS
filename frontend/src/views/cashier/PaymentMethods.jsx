import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import NoDataLottie from 'components/NoDataLottie';
import { fetchPayments, fetchPaymentStats } from 'container/payment/slice';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{ 
      borderRadius: 4, 
      border: '1px solid #eee',
      bgcolor: 'white',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
        borderColor: alpha(color, 0.2)
      }
    }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            bgcolor: alpha(color, 0.08), 
            color: color,
            display: 'flex'
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800}>{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const PaymentMethods = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { payments, stats, loading } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchPaymentStats());
  }, [dispatch]);

  const paymentMethodStats = {
    CASH: { count: 0, total: 0 },
    CARD: { count: 0, total: 0 },
    UPI: { count: 0, total: 0 },
    WALLET: { count: 0, total: 0 },
    OTHER: { count: 0, total: 0 }
  };

  (Array.isArray(payments) ? payments : []).forEach(payment => {
    if (paymentMethodStats[payment.method]) {
      paymentMethodStats[payment.method].count++;
      paymentMethodStats[payment.method].total += payment.amount;
    }
  });

  const getMethodIcon = (method) => {
    switch (method) {
      case 'CASH': return <AttachMoneyIcon />;
      case 'CARD': return <CreditCardIcon />;
      case 'UPI': return <QrCodeIcon />;
      case 'WALLET': return <AccountBalanceWalletIcon />;
      default: return <PaymentIcon />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'CASH': return theme.palette.success.main;
      case 'CARD': return theme.palette.primary.main;
      case 'UPI': return theme.palette.info.main;
      case 'WALLET': return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      height: '100vh', 
      overflowY: 'auto', 
      bgcolor: '#f8fafc',
      m: -3,
      backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
    }}>
      {/* Header removed */}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(paymentMethodStats).map(([method, data]) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={method}>
            <StatCard 
              title={method}
              value={`$${data.total.toFixed(2)}`}
              icon={getMethodIcon(method)}
              color={getMethodColor(method)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Recent Payments Table */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee', mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
          <Typography variant="h5" fontWeight={800}>Recent Transactions</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(payments || []).length > 0 ? (
                (payments || []).slice(0, 10).map((payment) => (
                  <TableRow key={payment._id || payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                        {payment.transactionId || payment._id?.slice(-8) || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ color: getMethodColor(payment.method), display: 'flex' }}>
                          {getMethodIcon(payment.method)}
                        </Box>
                        <Typography variant="body2" fontWeight={700}>{payment.method}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        ${(payment.amount || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status || 'COMPLETED'} 
                        size="small" 
                        sx={{ 
                          fontWeight: 800, 
                          borderRadius: 2,
                          bgcolor: payment.status === 'COMPLETED' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                          color: payment.status === 'COMPLETED' ? theme.palette.success.main : theme.palette.warning.main
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <NoDataLottie message="No payment transactions found" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PaymentMethods;

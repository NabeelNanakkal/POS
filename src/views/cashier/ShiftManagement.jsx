import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Divider,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
// import HistoryIcon from '@mui/icons-material/History';
// import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const ShiftManagement = () => {
  const theme = useTheme();
  
  // State
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [shiftData, setShiftData] = useState(null);
  const [openingBalance, setOpeningBalance] = useState('');
  const [openEndShiftDialog, setOpenEndShiftDialog] = useState(false);
  
  // Ending Shift State
  const [closingCash, setClosingCash] = useState('');
  const [closingCard, setClosingCard] = useState('');
  const [closingUpi, setClosingUpi] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [viewHistory, setViewHistory] = useState(false);

  // Mock System Totals
  const systemTotals = {
    cash: 1250.00,
    card: 3400.50,
    upi: 890.00
  };

  const calculateExpectedCash = () => {
    if (!shiftData) return 0;
    // Opening + Cash Sales + PayIns - PayOuts (Mock: 0 PayIns/Outs for now)
    return shiftData.openingBalance + systemTotals.cash; 
  };

  const handleStartShift = () => {
    if (!openingBalance) return;
    const now = new Date();
    setShiftData({
      startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startDate: now.toLocaleDateString(),
      openingBalance: parseFloat(openingBalance),
      user: 'Jane Doe',
      shiftId: '#SH-2024-001'
    });
    setIsShiftOpen(true);
  };

  const handleEndShift = () => {
    setIsShiftOpen(false);
    setShiftData(null);
    setOpenEndShiftDialog(false);
    setOpeningBalance('');
    setClosingCash('');
    setClosingCard('');
    setClosingUpi('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mock Transaction Log Data
  const TRANSACTIONS = [
    { id: 'TRX-101', time: '09:15 AM', type: 'Sale', desc: 'Order #1001', amount: 120.00, method: 'Cash', status: 'Completed' },
    { id: 'TRX-102', time: '09:45 AM', type: 'Sale', desc: 'Order #1002', amount: 450.50, method: 'Card', status: 'Completed' },
    { id: 'TRX-103', time: '10:30 AM', type: 'Return', desc: 'Refund Order #998', amount: -45.00, method: 'Card', status: 'Refunded' },
    { id: 'TRX-104', time: '11:00 AM', type: 'Pay Out', desc: 'Office Supplies', amount: -25.00, method: 'Cash', status: 'Expense' },
    { id: 'TRX-105', time: '11:45 AM', type: 'Sale', desc: 'Order #1003', amount: 89.00, method: 'UPI', status: 'Completed' },
    { id: 'TRX-106', time: '12:15 PM', type: 'Sale', desc: 'Order #1004', amount: 210.00, method: 'Card', status: 'Completed' },
    { id: 'TRX-107', time: '12:30 PM', type: 'Sale', desc: 'Order #1005', amount: 35.00, method: 'Cash', status: 'Completed' },
  ];

  const PREVIOUS_SHIFT_TRANSACTIONS = [
    { id: 'TRX-098', time: '06:15 PM', type: 'Sale', desc: 'Order #998', amount: 210.00, method: 'Card', status: 'Completed' },
    { id: 'TRX-097', time: '05:45 PM', type: 'Return', desc: 'Refund #990', amount: -25.00, method: 'Cash', status: 'Refunded' },
    { id: 'TRX-096', time: '05:30 PM', type: 'Sale', desc: 'Order #995', amount: 89.00, method: 'UPI', status: 'Completed' },
    { id: 'TRX-095', time: '04:15 PM', type: 'Sale', desc: 'Order #992', amount: 145.00, method: 'Card', status: 'Completed' },
    { id: 'TRX-094', time: '03:00 PM', type: 'Sale', desc: 'Order #990', amount: 65.00, method: 'Cash', status: 'Completed' },
  ];

  const activeTransactions = viewHistory ? PREVIOUS_SHIFT_TRANSACTIONS : TRANSACTIONS;

  if (!isShiftOpen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 3 }}>
        <Grid container spacing={4} sx={{ maxWidth: 1000 }}>
            <Grid item xs={12} md={7}>
                <Paper
                elevation={0}
                sx={{
                    p: 5,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                >
                    <Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
                        <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <LockClockOutlinedIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800}>Open Shift</Typography>
                            <Typography variant="body2" color="text.secondary">Enter opening amount to begin sales.</Typography>
                        </Box>
                    </Stack>

                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Opening Cash Drawer</Typography>
                    <TextField
                        fullWidth
                        placeholder="0.00"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                        type="number"
                        sx={{ mb: 4 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Typography fontWeight={700}>$</Typography></InputAdornment>,
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleStartShift}
                        disabled={!openingBalance}
                        sx={{ py: 2, borderRadius: 2, fontSize: '1rem', fontWeight: 800 }}
                    >
                        Start Shift
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%'
                    }}
                >
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Previous Shift</Typography>
                    <Stack spacing={2}>
                        <DataRow label="Closed By" value="John Doe" />
                        <DataRow label="End Time" value="Yesterday, 9:00 PM" />
                        <Divider />
                        <DataRow label="Total Sales" value="$4,530.50" bold />
                        <DataRow label="Discrepancy" value="-$5.00" color="error.main" />
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
      </Box>
    );
  }

  // ACTIVE SHIFT OVERVIEW
  return (
    <Box sx={{ width: '100%', px: 2 }}>
      
      {/* 1. Header Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.main' }}><PersonOutlineIcon /></Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>{shiftData.user}</Typography>
                    <Typography variant="caption" color="text.secondary">Cashier</Typography>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Shift ID</Typography>
                <Typography variant="body2" fontWeight={700}>{shiftData.shiftId}</Typography>
            </Box>
            <Box>
                 <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Started</Typography>
                 <Chip label={shiftData.startTime} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1, border: 'none', bgcolor: 'success.lighter' }} />
            </Box>
        </Stack>
        <Button 
            variant="contained" 
            color="error" 
            onClick={() => setOpenEndShiftDialog(true)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
            startIcon={<LockClockOutlinedIcon />}
        >
            End Shift
        </Button>
      </Paper>

      {/* Sales Metrics Grid (Moved Here) */}
      <Grid container spacing={2} sx={{ mb: 3, width: '100%' }}>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <DetailCard title="Total Sales" value={systemTotals.cash + systemTotals.card + systemTotals.upi} icon={<ReceiptLongIcon sx={{ fontSize: 32 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <DetailCard title="Card Sales" value={systemTotals.card} icon={<CreditCardIcon sx={{ fontSize: 32 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <DetailCard title="UPI / Digital" value={systemTotals.upi} icon={<QrCode2Icon sx={{ fontSize: 32 }} />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <DetailCard title="Returns" value={45.00} icon={<HistoryIcon sx={{ fontSize: 32 }} />} color="error" isNegative />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        
        {/* 2. Left Column: Drawer Management */}
        <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 , flexGrow: 1}}>
            
            {/* Drawer Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon color="primary" /> Drawer Management
                </Typography>
                <Divider sx={{ mb: 3, mt: 1 }} />

                <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'primary.lighter', borderRadius: 3, border: '1px solid', borderColor: 'primary.light' }}>
                    <Typography variant="body2" fontWeight={700} color="primary.main" gutterBottom>EXPECTED CASH IN DRAWER</Typography>
                    <Typography variant="h2" fontWeight={900} color="primary.main">${calculateExpectedCash().toFixed(2)}</Typography>
                </Box>

                <Stack spacing={2} sx={{ mt: 4 }}>
                    <CalculationRow label="Opening Balance" value={shiftData.openingBalance} />
                    <CalculationRow label="Cash Sales" value={systemTotals.cash} icon={<AddCircleOutlineIcon fontSize="small" color="success" />} />
                    <CalculationRow label="Pay Ins" value={0.00} icon={<AddCircleOutlineIcon fontSize="small"  />} />
                    <CalculationRow label="Pay Outs" value={0.00} icon={<RemoveCircleOutlineIcon fontSize="small" />} color="error.main" />
                </Stack>

                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Button fullWidth variant="outlined" startIcon={<AddCircleOutlineIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay In
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                         <Button fullWidth variant="outlined" color="error" startIcon={<RemoveCircleOutlineIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay Out
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            

        </Grid>

        {/* 3. Right Column: Transaction Log */}
        <Grid item xs={12} md={8} lg={8} sx={{ flexGrow: 1 }}>
            <Paper elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                         <Typography variant="subtitle1" fontWeight={800}>{viewHistory ? 'Previous Shift Log' : 'Transaction Log'}</Typography>
                         <Typography variant="caption" color="text.secondary">{viewHistory ? 'Yesterday, 9:00 PM - 5:00 PM' : 'Today, Current Shift'}</Typography>
                    </Box>
                    <Button 
                        size="small" 
                        variant={viewHistory ? "contained" : "outlined"} 
                        color={viewHistory ? "secondary" : "primary"}
                        startIcon={viewHistory ? <AccessTimeIcon /> : <HistoryIcon />}
                        onClick={() => { setViewHistory(!viewHistory); setPage(0); }}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                        {viewHistory ? 'Back to Current' : 'Load Previous'}
                    </Button>
                </Box>
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table stickyHeader size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'grey.50' }}>Time</TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'grey.50' }}>Description</TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'grey.50' }}>Type</TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'grey.50' }}>Method</TableCell>
                                <TableCell align="right" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'grey.50' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{row.time}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{row.desc}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.type} 
                                            size="small" 
                                            sx={{ 
                                                height: 24, 
                                                fontWeight: 700, 
                                                fontSize: '0.75rem', 
                                                bgcolor: row.type === 'Sale' ? 'success.lighter' : (row.type === 'Return' ? 'error.lighter' : 'grey.100'),
                                                color: row.type === 'Sale' ? 'success.main' : (row.type === 'Return' ? 'error.main' : 'text.secondary')
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell>{row.method}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, color: row.amount < 0 ? 'error.main' : 'inherit' }}>
                                        {row.amount < 0 ? '-' : ''}${Math.abs(row.amount).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={activeTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Grid>

      </Grid>


      {/* End Shift Dialog */}
      <Dialog 
        open={openEndShiftDialog} 
        onClose={() => setOpenEndShiftDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ p: 4, bgcolor: 'transparent', color: 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                     <LockClockOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
                     <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 0.5 }}>End Shift Reconciliation</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Verify system totals against actual cash.</Typography>
            </Box>
            <IconButton onClick={() => setOpenEndShiftDialog(false)} sx={{ color: 'text.secondary', bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>ENTER ACTUAL AMOUNTS</Typography>
                    <Stack spacing={2}>
                        <ReconciliationRow 
                            label="Cash Drawer" 
                            system={calculateExpectedCash()} 
                            value={closingCash} 
                            onChange={setClosingCash}
                            icon={<AttachMoneyIcon />}
                        />
                        <ReconciliationRow 
                            label="Card Terminal" 
                            system={systemTotals.card} 
                            value={closingCard} 
                            onChange={setClosingCard}
                            icon={<CreditCardIcon />}
                        />
                        <ReconciliationRow 
                            label="UPI / Digital" 
                            system={systemTotals.upi} 
                            value={closingUpi} 
                            onChange={setClosingUpi}
                            icon={<QrCode2Icon />}
                        />
                    </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEndShiftDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button onClick={handleEndShift} variant="contained" sx={{ fontWeight: 700, px: 3 }}>Finalize Shift</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper Components
const DataRow = ({ label, value, bold, color }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
        <Typography variant="body2" fontWeight={bold ? 800 : 600} color={color || 'text.primary'}>{value}</Typography>
    </Box>
);

const CalculationRow = ({ label, value, icon, color = 'text.primary' }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="body2" fontWeight={600} color="text.secondary">{label}</Typography>
        </Box>
        <Typography variant="body1" fontWeight={700} color={color}>${value.toFixed(2)}</Typography>
    </Box>
);

const DetailCard = ({ title, value, icon, color, isNegative }) => (
    <Paper 
        elevation={0} 
        sx={{ 
            width: '100%',
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'white',
            borderTop: '4px solid',
            borderColor: `${color}.main`,
            boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }
        }}
    >
        <Box>
             <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 0.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</Typography>
             <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                {isNegative ? '-' : ''}${value.toFixed(2)}
             </Typography>
        </Box>
        <Box sx={{ color: `${color}.main`, opacity: 0.8 }}>
            {icon}
        </Box>
    </Paper>
);

const ReconciliationRow = ({ label, system, value, onChange, icon }) => (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, transition: 'all 0.2s', '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.100', color: 'text.secondary', display: 'flex' }}>
            {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>System: ${system.toFixed(2)}</Typography>
        </Box>
        <TextField 
            variant="standard"
            placeholder="0.00" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            type="number"
            sx={{ width: 140, '& .MuiInput-input': { fontSize: '1.25rem', fontWeight: 700, textAlign: 'right' } }}
            InputProps={{ 
                disableUnderline: true,
                startAdornment: <InputAdornment position="start"><Typography variant="h6" color="text.secondary" fontWeight={700}>$</Typography></InputAdornment> 
            }}
        />
    </Paper>
);

export default ShiftManagement;

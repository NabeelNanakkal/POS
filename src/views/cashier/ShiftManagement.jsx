import { useState, useEffect } from 'react';
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
  Avatar,
  CircularProgress
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from 'react-redux';
import shiftService from 'services/shiftService';
import { toast } from 'react-toastify';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Lottie from 'lottie-react';
import noDataAnimation from 'assets/animations/noDataLottie.json';

const ShiftManagement = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.login);
  
  // State
  const [loading, setLoading] = useState(true);
  const [shiftData, setShiftData] = useState(null);
  const [openingBalance, setOpeningBalance] = useState('');
  const [openEndShiftDialog, setOpenEndShiftDialog] = useState(false);
  
  // Ending Shift State
  const [closingCash, setClosingCash] = useState('');
  const [closingCard, setClosingCard] = useState('');
  const [closingUpi, setClosingUpi] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [historyData, setHistoryData] = useState({ shifts: [], total: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);

  // Pay In / Pay Out State
  const [payDialog, setPayDialog] = useState({ open: false, type: 'IN', amount: '', reason: '' });

  // Fetch current shift on mount
  useEffect(() => {
    fetchCurrentShift();
    fetchShiftHistory();
  }, []);

  const fetchShiftHistory = async () => {
      try {
          setHistoryLoading(true);
          const res = await shiftService.getShiftHistory({ page: page + 1, limit: rowsPerPage });
          if (res.data && res.data.shifts) {
              setHistoryData({ shifts: res.data.shifts, total: res.data.pagination.total });
          }
      } catch (err) {
          console.error("Failed to load history", err);
      } finally {
          setHistoryLoading(false);
      }
  };

  useEffect(() => {
      fetchShiftHistory();
  }, [page, rowsPerPage]);

  const fetchCurrentShift = async () => {
    try {
      setLoading(true);
      const res = await shiftService.getCurrentShift();
      if (res.success && res.data) {
        setShiftData(res.data);
      } else {
        setShiftData(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load shift status');
    } finally {
      setLoading(false);
    }
  };

  const handleStartShift = async () => {
    if (!openingBalance) return;
    try {
        const res = await shiftService.startShift({ 
            openingBalance: parseFloat(openingBalance),
            storeId: user?.store?.id || user?.store?._id || user?.store 
        });
        if (res.success) {
            setShiftData(res.data);
            toast.success('Shift started successfully');
        }
    } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to start shift');
    }
  };

  const handleEndShift = async () => {
    try {
        const res = await shiftService.endShift({
            actualCash: parseFloat(closingCash) || 0,
            listActualCard: parseFloat(closingCard) || 0, // Note: Backend implementation might need adjustment if using list
            listActualUpi: parseFloat(closingUpi) || 0,
            notes: closingNotes
        });
        
        if (res.success) {
            setShiftData(null);
            setOpenEndShiftDialog(false);
            setOpeningBalance('');
            setClosingCash('');
            setClosingCard('');
            setClosingUpi('');
            setClosingNotes('');
            toast.success('Shift ended successfully');
            fetchShiftHistory(); // Refresh history
        }
    } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to end shift');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPayDialog = (type) => {
    setPayDialog({ open: true, type, amount: '', reason: '' });
  };

  const handleProcessPayTransaction = async () => {
    const amount = parseFloat(payDialog.amount);
    if (!amount || amount <= 0) return;

    try {
        const res = await shiftService.addCashMovement({
            type: payDialog.type,
            amount,
            reason: payDialog.reason
        });
        
        if (res.success) {
            setShiftData(res.data); // Update local state with new shift data (including movements)
            setPayDialog({ ...payDialog, open: false });
            toast.success(`Cash ${payDialog.type === 'IN' ? 'added' : 'removed'} successfully`);
        }
    } catch (err) {
        toast.error('Failed to process cash movement');
    }
  };

  // Calculate totals from shift data
  const calculateSystemTotals = () => {
      if (!shiftData) return { cash: 0, card: 0, upi: 0 };
      
      // If paymentSummary exists (for closed shifts or established structure), use it
      // But for active shifts, we might need realtime aggregation.
      // For now, assuming paymentSummary might be updated or 0.
      // The backend 'getCurrentShift' might not return live totals unless implemented.
      // Let's rely on what the backend gives or default to existing structure.
      
      // Note: Backend 'getCurrentShift' currently returns static shift object. 
      // To get live totals, the backend should aggregate orders.
      // Assuming backend returns 'paymentSummary' even if partial, or we should request it.
      // For this implementation, let's use what we have in shiftData.
      
      const cash = shiftData.paymentSummary?.cash || 0;
      const card = shiftData.paymentSummary?.card || 0;
      const upi = shiftData.paymentSummary?.upi || 0;
      
      return { cash, card, upi };
  };
  
  const calculatePayInsOuts = () => {
      if (!shiftData || !shiftData.cashMovements) return { ins: 0, outs: 0 };
      let ins = 0;
      let outs = 0;
      shiftData.cashMovements.forEach(m => {
          if (m.type === 'IN') ins += m.amount;
          else outs += m.amount;
      });
      return { ins, outs };
  };

  const systemTotals = calculateSystemTotals();
  const { ins: payIns, outs: payOuts } = calculatePayInsOuts();

  const calculateExpectedCash = () => {
    if (!shiftData) return 0;
    return (shiftData.openingBalance || 0) + systemTotals.cash + payIns - payOuts; 
  };

  if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (!shiftData) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                elevation={0}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
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
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Previous Shifts</Typography>
                    
                    {historyLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : historyData.shifts.length > 0 ? (
                        <>
                            <Stack spacing={2}>
                                {historyData.shifts.map((shift) => (
                                    <Paper 
                                        key={shift._id} 
                                        elevation={0}
                                        sx={{ 
                                            p: 2.5, 
                                            borderRadius: 3, 
                                            bgcolor: 'white', 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                borderColor: 'primary.light'
                                            }
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                                                    {new Date(shift.endTime).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                    {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label="CLOSED" 
                                                size="small" 
                                                color="default"
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    borderRadius: 1.5, 
                                                    height: 24,
                                                    fontSize: '0.65rem',
                                                    bgcolor: 'grey.100',
                                                    color: 'text.secondary'
                                                }} 
                                            />
                                        </Stack>
                                        
                                        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                                        
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    OPENING
                                                </Typography>
                                                <Typography variant="body2" fontWeight={700} color="text.primary">
                                                    ${(shift.openingBalance || 0).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    CASH
                                                </Typography>
                                                <Typography variant="body2" fontWeight={700} color="success.main">
                                                    ${(shift.paymentSummary?.cash || 0).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    TOTAL
                                                </Typography>
                                                <Typography variant="body2" fontWeight={800} color="primary.main">
                                                    ${((shift.paymentSummary?.cash || 0) + (shift.paymentSummary?.card || 0) + (shift.paymentSummary?.upi || 0)).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Stack>
                            <TablePagination
                                component="div"
                                count={historyData.total}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                            <Box sx={{ width: 180, mb: 1 }}>
                                <Lottie animationData={noDataAnimation} loop={true} />
                            </Box>
                            <Typography color="text.secondary" fontWeight={600}>No shift history found.</Typography>
                        </Box>
                    )}
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
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>Shift Active</Typography>
                    <Typography variant="caption" color="text.secondary">Cashier</Typography>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Shift ID</Typography>
                <Typography variant="body2" fontWeight={700}>{shiftData._id.slice(-6).toUpperCase()}</Typography>
            </Box>
            <Box>
                 <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Started</Typography>
                 <Chip label={new Date(shiftData.startTime).toLocaleTimeString()} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1, border: 'none', bgcolor: 'success.lighter' }} />
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

      {/* Sales Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} sx={{ flexGrow: 1 }}>
            <DetailCard title="Total Sales" value={systemTotals.cash + systemTotals.card + systemTotals.upi} icon={<ReceiptLongIcon sx={{ fontSize: 32 }} />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} sx={{ flexGrow: 1 }}>
            <DetailCard title="Card Sales" value={systemTotals.card} icon={<CreditCardIcon sx={{ fontSize: 32 }} />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} sx={{ flexGrow: 1 }}>
            <DetailCard title="UPI / Digital" value={systemTotals.upi} icon={<QrCode2Icon sx={{ fontSize: 32 }} />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }} sx={{ flexGrow: 1 }}>
            <DetailCard title="Expected Cash" value={calculateExpectedCash()} icon={<AttachMoneyIcon sx={{ fontSize: 32 }} />} color="success" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        
        {/* 2. Left Column: Drawer Management */}
        <Grid size={{ xs: 12, md: 4, lg: 4 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 , flexGrow: 1}}>
            
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
                    <CalculationRow label="Pay Ins" value={payIns} icon={<AddCircleOutlineIcon fontSize="small"  />} />
                    <CalculationRow label="Pay Outs" value={payOuts} icon={<RemoveCircleOutlineIcon fontSize="small" />} color="error.main" />
                </Stack>

                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={{ xs: 6 }}>
                        <Button fullWidth variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => handleOpenPayDialog('IN')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay In
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                         <Button fullWidth variant="outlined" color="error" startIcon={<RemoveCircleOutlineIcon />} onClick={() => handleOpenPayDialog('OUT')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay Out
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

        </Grid>

        {/* 3. Right Column: Transaction Log / Cash Movements */}
        <Grid size={{ xs: 12, md: 8, lg: 8 }} sx={{ flexGrow: 1 }}>
            <Paper elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                         <Typography variant="subtitle1" fontWeight={800}>Cash Movements</Typography>
                         <Typography variant="caption" color="text.secondary">Recent pay-ins and pay-outs</Typography>
                    </Box>
                </Box>
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table stickyHeader size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Reason</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shiftData.cashMovements && shiftData.cashMovements.length > 0 ? (
                                shiftData.cashMovements.slice().reverse().map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        {new Date(row.timestamp).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.type} 
                                            size="small" 
                                            color={row.type === 'IN' ? 'success' : 'error'}
                                            sx={{ fontWeight: 700, borderRadius: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.reason || '-'}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        ${row.amount.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No cash movements recorded.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                     <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 0.5 }}>End Shift</Typography>
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
                        <TextField
                            fullWidth
                            label="Closing Notes / Discrepancy Reason"
                            multiline
                            rows={2}
                            value={closingNotes}
                            onChange={(e) => setClosingNotes(e.target.value)}
                        />
                    </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEndShiftDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button onClick={handleEndShift} variant="contained" sx={{ fontWeight: 700, px: 3 }}>Finalize Shift</Button>
        </DialogActions>
      </Dialog>

      {/* Pay In / Out Dialog */}
       <Dialog 
        open={payDialog.open} 
        onClose={() => setPayDialog({ ...payDialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ p: 3, bgcolor: payDialog.type === 'IN' ? 'success.lighter' : 'error.lighter', color: payDialog.type === 'IN' ? 'success.dark' : 'error.dark' }}>
            <Typography variant="h6" fontWeight={800}>{payDialog.type === 'IN' ? 'Pay In (Add Cash)' : 'Pay Out (Remove Cash)'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField 
                    label="Amount" 
                    fullWidth 
                    type="number" 
                    value={payDialog.amount}
                    onChange={(e) => setPayDialog({ ...payDialog, amount: e.target.value })}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: '1.5rem', fontWeight: 700 }
                    }}
                    autoFocus
                />
                <TextField 
                    label="Reason / Description" 
                    fullWidth 
                    multiline 
                    rows={2}
                    value={payDialog.reason}
                    onChange={(e) => setPayDialog({ ...payDialog, reason: e.target.value })}
                    placeholder={payDialog.type === 'IN' ? "e.g. Added change" : "e.g. Vendor payment"}
                />
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPayDialog({ ...payDialog, open: false })} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button 
                onClick={handleProcessPayTransaction} 
                variant="contained" 
                color={payDialog.type === 'IN' ? 'success' : 'error'}
                disabled={!payDialog.amount}
                sx={{ fontWeight: 700, px: 3 }}
            >
                Confirm {payDialog.type === 'IN' ? 'Pay In' : 'Pay Out'}
            </Button>
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
        <Typography variant="body1" fontWeight={700} color={color}>${(value || 0).toFixed(2)}</Typography>
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

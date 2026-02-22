import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import config from 'config';
import { toast } from 'react-toastify';

// Icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CoffeeIcon from '@mui/icons-material/Coffee';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HistoryIcon from '@mui/icons-material/History';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NoDataLottie from 'components/NoDataLottie';
import { startBreak, endBreak, fetchCurrentShift, openShift, closeShift } from 'container/shift/slice';
import { formatAmountWithComma, getCurrencySymbol } from 'utils/formatAmount';

const ShiftManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (user?.role || 'CASHIER').toUpperCase();
  const isManager = ['MANAGER', 'ADMIN', 'SUPER_ADMIN', 'TENANTADMIN'].includes(userRole);

  const loginUser = useSelector((state) => state.shift.currentShift);
  
  const [shifts, setShifts] = useState([]);
  const [totalShifts, setTotalShifts] = useState(0);
  const [loading, setLoading] = useState(true);
  const reduxLoading = useSelector((state) => state.shift.loading);
  const [error, setError] = useState(null);
  
  // Advanced Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    startDate: '',
    endDate: '',
    sortBy: 'startTime',
    sortOrder: 'desc'
  });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Shift state from Redux
  const effectiveShift = loginUser;
  const isShiftOpen = !!loginUser;

  const [openingBalance, setOpeningBalance] = useState('');
  const [payIns, setPayIns] = useState(0);
  const [payOuts, setPayOuts] = useState(0);
  const [payDialog, setPayDialog] = useState({ open: false, type: 'IN', amount: '', reason: '' });
  const [openEndShiftDialog, setOpenEndShiftDialog] = useState(false);
  const [closingCash, setClosingCash] = useState('');
  const [closingCard, setClosingCard] = useState('');
  const [closingUpi, setClosingUpi] = useState('');
  
  // Break Details Dialog State
  const [breakDetails, setBreakDetails] = useState({ open: false, list: [] });

  const [viewHistory, setViewHistory] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  // Fetch shifts for Managers
  useEffect(() => {
    if (isManager) {
      const fetchShifts = async () => {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams({
             page: page + 1,
             limit: rowsPerPage,
             ...filters
          });
          
          // Remove empty filters
          if (!filters.search) params.delete('search');
          if (filters.status === 'ALL') params.delete('status');
          if (!filters.startDate) params.delete('startDate');
          if (!filters.endDate) params.delete('endDate');

          const res = await axios.get(`${config.ip}/shifts/store?${params.toString()}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            withCredentials: true
          });
          
          if (res.data.success) {
            // Check if response has new structure with pagination
            if (res.data.data.shifts && res.data.data.pagination) {
                setShifts(res.data.data.shifts);
                setTotalShifts(res.data.data.pagination.total);
            } else {
                // Fallback for old structure (array only)
                setShifts(Array.isArray(res.data.data) ? res.data.data : []);
                setTotalShifts(Array.isArray(res.data.data) ? res.data.data.length : 0);
            }
          }
        } catch (err) {
          console.error('Failed to fetch shifts', err);
          setError('Failed to load shift history. Please check your connection.');
        } finally {
          setLoading(false);
        }
      };
      fetchShifts();
    } else {
        setLoading(false);
    }
  }, [isManager, page, rowsPerPage, filters]);

  const shiftError = useSelector((state) => state.shift.error);

  useEffect(() => {
    if (shiftError) {
      toast.error(shiftError);
    }
  }, [shiftError]);

  // Fetch current shift on mount for cashier
  useEffect(() => {
    console.log('ShiftManagement mounted. isManager:', isManager);
    if (!isManager) {
      dispatch(fetchCurrentShift());
    }
  }, [isManager, dispatch]);

  const handleStartShift = () => {
    console.log('handleStartShift called. Balance:', openingBalance);
    if (!openingBalance) return;
    dispatch(openShift({ openingBalance: parseFloat(openingBalance) }));
  };

  const handleEndShift = () => {
    console.log('handleEndShift called. effectiveShift:', effectiveShift);
    dispatch(closeShift({
        closingBalance: parseFloat(closingCash) || (effectiveShift?.openingBalance + systemTotals.cash),
        totalSales: systemTotals.cash + systemTotals.card + systemTotals.upi,
        itemsSold: effectiveShift?.itemsSold || 0
    }));
    setOpenEndShiftDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateExpectedCash = () => {
    if (!effectiveShift) return 0;
    return (effectiveShift.openingBalance || 0) + (systemTotals.cash || 0) + (payIns || 0) - (payOuts || 0); 
  };

  const handleOpenPayDialog = (type) => {
    setPayDialog({ open: true, type, amount: '', reason: '' });
  };

  const handleProcessPayTransaction = () => {
    const amount = parseFloat(payDialog.amount);
    if (!amount || amount <= 0) return;

    if (payDialog.type === 'IN') {
        setPayIns(prev => prev + amount);
    } else {
        setPayOuts(prev => prev + amount);
    }
    setPayDialog({ ...payDialog, open: false });
  };

  // Mock System Totals for active shift
  const systemTotals = {
    cash: 1250.00,
    card: 3400.50,
    upi: 890.00
  };

  const activeTransactions = []; // Mock to prevent crash if used

  const calculateTotalBreakTime = (breaks) => {
    if (!breaks || !breaks.length) return '0 min';
    let totalMs = 0;
    let hasActive = false;
    breaks.forEach(b => {
      if (b.startTime && b.endTime) {
        totalMs += new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
      } else if (b.startTime && !b.endTime) {
        hasActive = true;
        totalMs += new Date().getTime() - new Date(b.startTime).getTime();
      }
    });
    const mins = Math.floor(totalMs / 60000);
    if (hasActive) return `Active (${mins}m)`;
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  if (loading || (reduxLoading && !isManager && !effectiveShift)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
        <Typography variant="h5" color="text.secondary" sx={{ ml: 2 }}>Loading shift data...</Typography>
      </Box>
    );
  }
  if (isManager) {
    return (
      <Box sx={{ 
          p: { xs: 2, md: 4 }, 
          height: '100vh', 
          overflowY: 'auto', 
          bgcolor: '#f8fafc',
          m: -3,
          backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
              p: 2, 
              mb: 4, 
              borderRadius: 4, 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Box sx={{ flex: 2.5, minWidth: { md: 300 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search cashier name or ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: { md: 150 } }}>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{ borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: 1.2, minWidth: { md: 160 } }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.startDate}
                onChange={(e) => {
                  handleFilterChange('startDate', e.target.value);
                  handleFilterChange('endDate', e.target.value);
                }}
                InputProps={{
                  sx: { borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
                }}
              />
            </Box>
          </Stack>
          {error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
              <Typography color="error.main" variant="body2" fontWeight={700}>{error}</Typography>
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Cashier</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Opening</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>End Time</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right' }}>Sales</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right' }}>Cl. Bal</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'center' }}>Breaks</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift._id} hover>
                    <TableCell>{new Date(shift.startTime).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: '0.875rem', fontWeight: 700 }}>
                          {shift.user?.username?.substring(0, 2).toUpperCase() || 'US'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{shift.user?.username || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {shift.employeeId || 'No ID'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{formatAmountWithComma(shift.openingBalance || 0)}</TableCell>
                    <TableCell>{new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                    <TableCell>
                      {shift.endTime ? new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatAmountWithComma(shift.totalSales || 0)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {shift.status === 'CLOSED' 
                        ? formatAmountWithComma(shift.closingBalance !== undefined ? shift.closingBalance : (shift.openingBalance + shift.totalSales)) 
                        : 'NA'}
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        size="small" 
                        startIcon={<CoffeeIcon fontSize="small" />}
                        onClick={() => setBreakDetails({ open: true, list: shift.breaks || [] })}
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          textTransform: 'none',
                          color: shift.breaks?.length > 0 ? 'warning.main' : 'text.disabled',
                          flexDirection: 'column',
                          lineHeight: 1
                        }}
                      >
                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>
                          {calculateTotalBreakTime(shift.breaks)}
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={shift.status} 
                        size="small" 
                        color={shift.status === 'OPEN' ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {shifts.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <NoDataLottie message="No shift history found for this store." size="15%" />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalShifts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Break Details Modal */}
        <Dialog 
          open={breakDetails.open} 
          onClose={() => setBreakDetails({ ...breakDetails, open: false })}
          maxWidth="sm"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 4,
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.15)'
            } 
          }}
        >
          <DialogTitle component="div" sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ p: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2, color: 'warning.main', display: 'flex' }}>
                <CoffeeIcon />
              </Box>
              <Typography variant="h4" fontWeight={800}>Break History</Typography>
            </Stack>
            <IconButton onClick={() => setBreakDetails({ ...breakDetails, open: false })} size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <TableContainer>
              <Table sx={{ minWidth: 500 }}>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary', py: 2 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>START</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>END</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>DURATION</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', pr: 3 }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {breakDetails.list.length > 0 ? (
                    breakDetails.list.map((item, index) => {
                      const startTime = new Date(item.startTime);
                      const endTime = item.endTime ? new Date(item.endTime) : null;
                      const duration = endTime ? Math.round((endTime - startTime) / 60000) : null;
                      
                      return (
                        <TableRow key={index} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell sx={{ py: 2 }}>
                            <Chip 
                              label={item.type || 'OTHER'} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontWeight: 700, 
                                borderRadius: 1.5,
                                fontSize: '0.65rem',
                                color: 'text.primary',
                                border: '1px solid',
                                borderColor: 'divider'
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: endTime ? 'text.primary' : 'text.disabled' }}>
                              {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {duration !== null ? (
                              <Typography variant="caption" fontWeight={700} color="primary.main">
                                {duration} min
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.disabled">-</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 3 }}>
                            <Chip 
                              label={endTime ? "Finished" : "Active"} 
                              size="small" 
                              color={endTime ? "success" : "warning"}
                              sx={{ 
                                fontWeight: 800, 
                                borderRadius: 1.5,
                                height: 24,
                                fontSize: '0.65rem',
                                textTransform: 'uppercase'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <NoDataLottie message="No breaks recorded for this shift." size="120px" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
                onClick={() => setBreakDetails({ ...breakDetails, open: false })} 
                variant="contained" 
                color="inherit"
                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'grey.100', color: 'text.primary', '&:hover': { bgcolor: 'grey.200' } }}
            >
                Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // If not a manager and no shift is open, show "Open Shift" view
  if (!isShiftOpen || !shiftData) {
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
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || parseFloat(val) >= 0) {
                                setOpeningBalance(val);
                            }
                        }}
                        type="number"
                        sx={{ mb: 4 }}
                        inputProps={{ min: 0, step: "0.01" }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Typography fontWeight={700}>{getCurrencySymbol()}</Typography></InputAdornment>,
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
                        <DataRow label="Closed By" value={user?.username || 'User'} />
                        <DataRow label="End Time" value="Yesterday, 9:00 PM" />
                        <Divider />
                        <DataRow label="Total Sales" value={formatAmountWithComma(4530.50)} bold />
                        <DataRow label="Discrepancy" value={`-${getCurrencySymbol()}5.00`} color="error.main" />
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
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>{effectiveShift?.user?.username || effectiveShift?.user}</Typography>
                    <Typography variant="caption" color="text.secondary">Cashier</Typography>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Shift ID</Typography>
                <Typography variant="body2" fontWeight={700}>{effectiveShift?.shiftId || `#SH-${effectiveShift?._id?.substring(0,8)}`}</Typography>
            </Box>
            <Box>
                 <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Started</Typography>
                 <Chip label={effectiveShift?.startTime ? new Date(effectiveShift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1, border: 'none', bgcolor: 'success.lighter' }} />
            </Box>
            <Box>
                 <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>Total Break</Typography>
                 <Tooltip title="View Break History">
                    <Chip 
                        icon={<CoffeeIcon sx={{ fontSize: '1rem !important' }} />}
                        label={calculateTotalBreakTime(effectiveShift?.breaks)} 
                        onClick={() => setBreakDetails({ open: true, list: effectiveShift?.breaks || [] })}
                        size="small" 
                        color="warning" 
                        variant="outlined" 
                        sx={{ 
                            fontWeight: 700, 
                            borderRadius: 1, 
                            border: 'none', 
                            bgcolor: 'warning.lighter',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'warning.light' }
                        }} 
                    />
                 </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
            <Button
                variant="outlined"
                color="warning"
                startIcon={<CoffeeIcon />}
                onClick={() => {
                  const activeBreak = effectiveShift?.breaks?.find(b => !b.endTime);
                  console.log('Break button clicked. Active break:', activeBreak);
                  if (activeBreak) {
                    dispatch(endBreak());
                  } else {
                    dispatch(startBreak({ type: 'OTHER', note: 'Break started from Shift Management' }));
                  }
                }}
                sx={{ fontWeight: 700, borderRadius: 2 }}
            >
                {effectiveShift?.breaks?.find(b => !b.endTime) ? 'End Break' : 'Take Break'}
            </Button>
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
        {/* 2. Left Column: Transaction Log (Moved to Left) */}
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
                                        {row.amount < 0 ? '-' : ''}{getCurrencySymbol()}{Math.abs(row.amount).toFixed(2)}
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

        {/* 3. Right Column: Drawer Management (Moved to Right) */}
        <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 , flexGrow: 1}}>
            {/* Drawer Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon color="primary" /> Drawer Management
                </Typography>
                <Divider sx={{ mb: 3, mt: 1 }} />

                <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'primary.lighter', borderRadius: 3, border: '1px solid', borderColor: 'primary.light' }}>
                    <Typography variant="body2" fontWeight={700} color="primary.main" gutterBottom>EXPECTED CASH IN DRAWER</Typography>
                    <Typography variant="h2" fontWeight={900} color="primary.main">{formatAmountWithComma(calculateExpectedCash())}</Typography>
                </Box>

                <Stack spacing={2} sx={{ mt: 4 }}>
                    <CalculationRow label="Opening Balance" value={effectiveShift?.openingBalance || 0} />
                    <CalculationRow label="Cash Sales" value={systemTotals.cash} icon={<AddCircleOutlineIcon fontSize="small" color="success" />} />
                    <CalculationRow label="Pay Ins" value={payIns} icon={<AddCircleOutlineIcon fontSize="small"  />} />
                    <CalculationRow label="Pay Outs" value={payOuts} icon={<RemoveCircleOutlineIcon fontSize="small" />} color="error.main" />
                </Stack>

                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Button fullWidth variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => handleOpenPayDialog('IN')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay In
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                         <Button fullWidth variant="outlined" color="error" startIcon={<RemoveCircleOutlineIcon />} onClick={() => handleOpenPayDialog('OUT')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Pay Out
                        </Button>
                    </Grid>
                </Grid>
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
        <DialogTitle component="div" sx={{ p: 4, bgcolor: 'transparent', color: 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Pay In / Out Dialog */}
       <Dialog 
        open={payDialog.open} 
        onClose={() => setPayDialog({ ...payDialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle component="div" sx={{ p: 3, bgcolor: payDialog.type === 'IN' ? 'success.lighter' : 'error.lighter', color: payDialog.type === 'IN' ? 'success.dark' : 'error.dark' }}>
            <Typography variant="h6" fontWeight={800}>{payDialog.type === 'IN' ? 'Pay In (Add Cash)' : 'Pay Out (Remove Cash)'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField 
                    label="Amount" 
                    fullWidth 
                    type="number" 
                    value={payDialog.amount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || parseFloat(val) >= 0) {
                            setPayDialog({ ...payDialog, amount: val });
                        }
                    }}
                    inputProps={{ min: 0, step: "0.01" }}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
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
        <Typography variant="body1" fontWeight={700} color={color}>{formatAmountWithComma(value || 0)}</Typography>
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
        }}
    >
        <Box>
             <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 0.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</Typography>
             <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                {isNegative ? '-' : ''}{formatAmountWithComma(value || 0)}
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
            <Typography variant="caption" color="text.secondary" fontWeight={500}>System: {formatAmountWithComma(system)}</Typography>
        </Box>
        <TextField 
            variant="standard"
            placeholder="0.00" 
            value={value} 
            onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseFloat(val) >= 0) {
                    onChange(val);
                }
            }} 
            type="number"
            sx={{ width: 140, '& .MuiInput-input': { fontSize: '1.25rem', fontWeight: 700, textAlign: 'right' } }}
            inputProps={{ min: 0, step: "0.01" }}
            InputProps={{ 
                disableUnderline: true,
                startAdornment: <InputAdornment position="start"><Typography variant="h6" color="text.secondary" fontWeight={700}>{getCurrencySymbol()}</Typography></InputAdornment> 
            }}
        />
    </Paper>
);

export default ShiftManagement;

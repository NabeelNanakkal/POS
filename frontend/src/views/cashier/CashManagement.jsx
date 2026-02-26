import { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Grid, Typography, Button, Chip, Stack, Avatar,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, IconButton, CircularProgress, Tooltip, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, AlertTitle
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import cashSessionService from 'services/cashSession.service';
import { formatAmountWithComma, getCurrencySymbol } from 'utils/formatAmount';

// Icons
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

// ─── Transaction type config ─────────────────────────────────────────────────
const TX_CONFIG = {
  SALE:     { label: 'Cash Sale',   color: 'success', Icon: ShoppingCartOutlinedIcon,     sign: '+' },
  REFUND:   { label: 'Refund',      color: 'warning', Icon: AssignmentReturnOutlinedIcon,  sign: '-' },
  CASH_IN:  { label: 'Cash In',     color: 'info',    Icon: TrendingUpIcon,                sign: '+' },
  CASH_OUT: { label: 'Cash Out',    color: 'error',   Icon: TrendingDownIcon,              sign: '-' },
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, amount, color, Icon, sign }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette[color].main, 0.2),
        bgcolor: alpha(theme.palette[color].main, 0.04),
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="caption" color={`${color}.main`} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.65rem' }}>
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={900} color={`${color}.main`} sx={{ mt: 0.5, letterSpacing: '-0.03em' }}>
            {sign}{formatAmountWithComma(amount || 0)}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.12), color: `${color}.main`, width: 40, height: 40 }}>
          <Icon sx={{ fontSize: '1.2rem' }} />
        </Avatar>
      </Stack>
    </Paper>
  );
};

// ─── Open Session Dialog ──────────────────────────────────────────────────────
const OpenSessionDialog = ({ open, onClose, onOpen }) => {
  const [amount, setAmount] = useState('');
  const [counter, setCounter] = useState('MAIN');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) { setAmount(''); setCounter('MAIN'); } }, [open]);

  const handleSubmit = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) { toast.error('Enter a valid opening amount'); return; }
    setLoading(true);
    try {
      await onOpen({ openingBalance: val, counter });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <LockOpenOutlinedIcon color="primary" />
          <span>Open Cash Session</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Enter the float cash placed in the counter at the start of the day.
            This amount stays <strong>fixed</strong> — only transactions change the balance.
          </Alert>
          <TextField
            label="Counter ID"
            value={counter}
            onChange={e => setCounter(e.target.value.toUpperCase())}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Opening Cash Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
            inputProps={{ min: 0, step: '0.001' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
              sx: { fontWeight: 800, fontSize: '1.2rem' }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !amount}
          startIcon={loading ? <CircularProgress size={14} /> : <LockOpenOutlinedIcon />}
          sx={{ borderRadius: 2, px: 3, fontWeight: 800 }}
        >
          Open Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Cash Movement Dialog (Cash In / Cash Out) ────────────────────────────────
const CashMovementDialog = ({ open, type, sessionId, onClose, onDone }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isCashIn = type === 'CASH_IN';

  useEffect(() => { if (!open) { setAmount(''); setDescription(''); } }, [open]);

  const handleSubmit = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { toast.error('Enter a valid amount'); return; }
    if (!description.trim()) { toast.error('Description is required'); return; }
    setLoading(true);
    try {
      await cashSessionService.addMovement({ sessionId, type, amount: val, description: description.trim() });
      toast.success(`${isCashIn ? 'Cash In' : 'Cash Out'} recorded`);
      onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record movement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {isCashIn
            ? <AddCircleOutlineIcon color="info" />
            : <RemoveCircleOutlineIcon color="error" />}
          <span>{isCashIn ? 'Cash In' : 'Cash Out'}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
            inputProps={{ min: 0.001, step: '0.001' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
              sx: { fontWeight: 800, fontSize: '1.1rem' }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Description / Reason"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={isCashIn ? 'e.g. Change top-up' : 'e.g. Safe transfer, Expense'}
            multiline
            rows={2}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button
          variant="contained"
          color={isCashIn ? 'info' : 'error'}
          onClick={handleSubmit}
          disabled={loading || !amount || !description}
          startIcon={loading ? <CircularProgress size={14} /> : (isCashIn ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />)}
          sx={{ borderRadius: 2, px: 3, fontWeight: 800 }}
        >
          Record {isCashIn ? 'Cash In' : 'Cash Out'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Close Session Dialog ─────────────────────────────────────────────────────
const CloseSessionDialog = ({ open, session, totals, onClose, onClosed }) => {
  const theme = useTheme();
  const [actualCash, setActualCash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) { setActualCash(''); setNotes(''); } }, [open]);

  const actual = parseFloat(actualCash) || 0;
  const expected = totals?.expectedBalance || 0;
  const diff = actual - expected;
  const hasAmount = actualCash !== '' && !isNaN(parseFloat(actualCash));

  const handleClose = async () => {
    if (!hasAmount) { toast.error('Enter the actual cash count'); return; }
    setLoading(true);
    try {
      await cashSessionService.close(session?._id, { closingBalance: actual, notes: notes.trim() || undefined });
      toast.success('Cash session closed successfully');
      onClosed();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close session');
    } finally {
      setLoading(false);
    }
  };

  const rows = [
    { label: 'Opening Balance',  value: totals?.openingBalance || 0,  color: 'text.primary',  sign: '' },
    { label: 'Cash Sales',       value: totals?.cashSales || 0,       color: 'success.main',  sign: '+ ' },
    { label: 'Cash In',          value: totals?.cashIn || 0,          color: 'info.main',     sign: '+ ' },
    { label: 'Cash Refunds',     value: totals?.cashRefunds || 0,     color: 'warning.main',  sign: '- ' },
    { label: 'Cash Out',         value: totals?.cashOut || 0,         color: 'error.main',    sign: '- ' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <LockOutlinedIcon color="error" />
            <span>Close Day — Cash Summary</span>
          </Stack>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* Summary table */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', mb: 2.5 }}>
          <Stack spacing={1.2}>
            {rows.map(row => (
              <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight={600}>{row.label}</Typography>
                <Typography variant="body2" fontWeight={800} color={row.color}>
                  {row.sign}{formatAmountWithComma(row.value)}
                </Typography>
              </Stack>
            ))}
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={900}>Expected Total</Typography>
              <Typography variant="subtitle1" fontWeight={900} color="primary.main">
                {formatAmountWithComma(expected)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Actual cash input */}
        <Stack spacing={2}>
          <TextField
            label="Actual Physical Cash Count"
            type="number"
            value={actualCash}
            onChange={e => setActualCash(e.target.value)}
            autoFocus
            inputProps={{ min: 0, step: '0.001' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
              sx: { fontWeight: 800, fontSize: '1.2rem' }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Difference display */}
          {hasAmount && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: '2px solid',
                borderColor: diff === 0 ? 'success.main' : diff > 0 ? 'info.main' : 'error.main',
                bgcolor: diff === 0
                  ? alpha(theme.palette.success.main, 0.05)
                  : diff > 0
                    ? alpha(theme.palette.info.main, 0.05)
                    : alpha(theme.palette.error.main, 0.05),
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  {diff === 0
                    ? <CheckCircleOutlineIcon color="success" />
                    : diff > 0
                      ? <TrendingUpIcon color="info" />
                      : <WarningAmberOutlinedIcon color="error" />}
                  <Typography fontWeight={800} color={diff === 0 ? 'success.main' : diff > 0 ? 'info.main' : 'error.main'}>
                    {diff === 0 ? 'Balanced' : diff > 0 ? 'Excess Cash' : 'Cash Shortage'}
                  </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={900} color={diff === 0 ? 'success.main' : diff > 0 ? 'info.main' : 'error.main'}>
                  {diff > 0 ? '+' : ''}{formatAmountWithComma(Math.abs(diff))}
                </Typography>
              </Stack>
            </Paper>
          )}

          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            multiline
            rows={2}
            placeholder="Any remarks for this session..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          disabled={loading || !hasAmount}
          startIcon={loading ? <CircularProgress size={14} /> : <LockOutlinedIcon />}
          sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
        >
          Close Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Session History Dialog ───────────────────────────────────────────────────
const SessionHistoryDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    if (open) fetchHistory();
    else { setSelected(null); setSelectedSummary(null); }
  }, [open]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await cashSessionService.getSessions({ limit: 30 });
      setSessions(res.data?.sessions || []);
    } catch {
      toast.error('Failed to load session history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (session) => {
    setSelected(session);
    try {
      const res = await cashSessionService.getSummary(session._id);
      setSelectedSummary(res.data);
    } catch {
      setSelectedSummary(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, height: '85vh' } }}>
      <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <HistoryIcon color="primary" />
            <span>Session History</span>
          </Stack>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', overflow: 'hidden' }}>
        {/* Session list */}
        <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', p: 1.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress size={28} /></Box>
          ) : sessions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No sessions found</Typography>
          ) : sessions.map(s => (
            <Paper
              key={s._id}
              elevation={0}
              onClick={() => handleSelect(s)}
              sx={{
                p: 1.5, mb: 1, borderRadius: 2.5, cursor: 'pointer',
                border: '1px solid',
                borderColor: selected?._id === s._id ? 'primary.main' : 'divider',
                bgcolor: selected?._id === s._id ? alpha(theme.palette.primary.main, 0.05) : 'white',
                '&:hover': { borderColor: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.03) }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" fontWeight={800}>{s.date}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.counter} · {s.openedBy?.name || s.openedBy?.username}</Typography>
                </Box>
                <Chip
                  label={s.status}
                  size="small"
                  color={s.status === 'OPEN' ? 'success' : 'default'}
                  sx={{ fontWeight: 800, fontSize: '0.6rem', height: 20 }}
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.6rem' }}>Opening</Typography>
                  <Typography variant="caption" fontWeight={700}>{formatAmountWithComma(s.openingBalance)}</Typography>
                </Box>
                {s.status === 'CLOSED' && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.6rem' }}>Difference</Typography>
                    <Typography variant="caption" fontWeight={700} color={s.difference === 0 ? 'success.main' : s.difference > 0 ? 'info.main' : 'error.main'}>
                      {s.difference > 0 ? '+' : ''}{formatAmountWithComma(s.difference || 0)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Session detail */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          {!selected ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.disabled" variant="body2">Select a session to view details</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" fontWeight={800}>{selected.date} — {selected.counter}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Opened by {selected.openedBy?.name || selected.openedBy?.username}
                      {' · '}{new Date(selected.openedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                  {selected.closedAt && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeOutlinedIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Closed {new Date(selected.closedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Stack>
                  )}
                </Box>
                <Chip label={selected.status} color={selected.status === 'OPEN' ? 'success' : 'default'} size="small" sx={{ fontWeight: 800 }} />
              </Stack>

              {selectedSummary && (
                <>
                  <Grid container spacing={1.5}>
                    {[
                      { label: 'Opening', value: selectedSummary.totals.openingBalance, color: 'primary' },
                      { label: 'Sales',   value: selectedSummary.totals.cashSales,     color: 'success' },
                      { label: 'Cash In', value: selectedSummary.totals.cashIn,        color: 'info' },
                      { label: 'Refunds', value: selectedSummary.totals.cashRefunds,   color: 'warning' },
                      { label: 'Cash Out',value: selectedSummary.totals.cashOut,       color: 'error' },
                      { label: 'Expected',value: selectedSummary.totals.expectedBalance, color: 'secondary' },
                    ].map(c => (
                      <Grid item xs={4} key={c.label}>
                        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette[c.color]?.main || '#000', 0.2), bgcolor: alpha(theme.palette[c.color]?.main || '#000', 0.04), textAlign: 'center' }}>
                          <Typography variant="caption" color={`${c.color}.main`} fontWeight={700} display="block" sx={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>{c.label}</Typography>
                          <Typography variant="body2" fontWeight={800} color={`${c.color}.main`}>{formatAmountWithComma(c.value)}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {selected.status === 'CLOSED' && (
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '2px solid', borderColor: selected.difference === 0 ? 'success.main' : selected.difference > 0 ? 'info.main' : 'error.main', bgcolor: 'grey.50' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>Actual Cash</Typography>
                          <Typography variant="h6" fontWeight={900}>{formatAmountWithComma(selected.closingBalance)}</Typography>
                        </Stack>
                        <Stack alignItems="flex-end">
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {selected.difference === 0 ? 'Balanced' : selected.difference > 0 ? 'Excess' : 'Shortage'}
                          </Typography>
                          <Typography variant="h6" fontWeight={900} color={selected.difference === 0 ? 'success.main' : selected.difference > 0 ? 'info.main' : 'error.main'}>
                            {selected.difference > 0 ? '+' : ''}{formatAmountWithComma(Math.abs(selected.difference || 0))}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  )}

                  <Typography variant="subtitle2" fontWeight={800}>Transactions ({selectedSummary.transactions.length})</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Description</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSummary.transactions.map(tx => {
                          const cfg = TX_CONFIG[tx.type];
                          return (
                            <TableRow key={tx._id} hover>
                              <TableCell>
                                <Chip label={cfg.label} size="small" color={cfg.color} sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20 }} />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.75rem', maxWidth: 180 }}>
                                <Typography variant="caption" noWrap display="block">{tx.description || tx.reference || '—'}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight={800} color={`${cfg.color}.main`}>
                                  {cfg.sign}{formatAmountWithComma(tx.amount)}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main CashManagement Page ─────────────────────────────────────────────────
const CashManagement = () => {
  const theme = useTheme();
  const { user } = useSelector(s => s.login);

  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [summary, setSummary] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [movementDialog, setMovementDialog] = useState({ open: false, type: '' });
  const [closeDialog, setCloseDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);

  // ── Fetch active session + summary ──────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cashSessionService.getActive();
      const session = res.data;
      setActiveSession(session || null);
      if (session) {
        const sumRes = await cashSessionService.getSummary(session._id);
        setSummary(sumRes.data || null);
      } else {
        setSummary(null);
      }
    } catch (err) {
      toast.error('Failed to load cash session');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Open session ─────────────────────────────────────────────────────────────
  const handleOpenSession = async (data) => {
    try {
      await cashSessionService.open(data);
      toast.success('Cash session opened!');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open session');
      throw err;
    }
  };

  // ── After movement recorded, refresh ────────────────────────────────────────
  const handleMovementDone = () => fetchData();

  // ── After close ──────────────────────────────────────────────────────────────
  const handleClosed = () => { setActiveSession(null); setSummary(null); fetchData(); };

  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
              <AccountBalanceWalletOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ lineHeight: 1 }}>Cash Management</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                Opening balance, cash tracking, and daily closing
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchData} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialog(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            History
          </Button>
        </Stack>
      </Stack>

      {/* ── NO ACTIVE SESSION ── */}
      {!activeSession && (
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              textAlign: 'center',
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'inline-flex', mb: 2.5 }}>
              <LockOpenOutlinedIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={900} gutterBottom>No Active Cash Session</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>
              Start the day by opening a new cash session. Enter the float cash placed in the counter.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LockOpenOutlinedIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ borderRadius: 2.5, px: 5, py: 1.5, fontWeight: 800, fontSize: '1rem' }}
            >
              Open Cash Session
            </Button>
          </Paper>
        </Box>
      )}

      {/* ── ACTIVE SESSION ── */}
      {activeSession && summary && (
        <Stack spacing={3}>
          {/* Session status banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: '1px solid',
              borderColor: alpha(theme.palette.success.main, 0.25),
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', width: 44, height: 44 }}>
                  <LockOpenOutlinedIcon />
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={800}>Session Open</Typography>
                    <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Counter: <strong>{activeSession.counter}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">·</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Date: <strong>{activeSession.date}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">·</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeOutlinedIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Opened at {new Date(activeSession.openedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' by '}<strong>{activeSession.openedBy?.name || activeSession.openedBy?.username || 'N/A'}</strong>
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
              <Button
                variant="contained"
                color="error"
                startIcon={<LockOutlinedIcon />}
                onClick={() => setCloseDialog(true)}
                sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', px: 3 }}
              >
                Close Day
              </Button>
            </Stack>
          </Paper>

          {/* Summary cards */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Opening Balance" amount={summary.totals.openingBalance} color="primary" Icon={LockOpenOutlinedIcon} sign="" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Cash Sales" amount={summary.totals.cashSales} color="success" Icon={ShoppingCartOutlinedIcon} sign="+" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Cash In" amount={summary.totals.cashIn} color="info" Icon={TrendingUpIcon} sign="+" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Cash Refunds" amount={summary.totals.cashRefunds} color="warning" Icon={AssignmentReturnOutlinedIcon} sign="-" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Cash Out" amount={summary.totals.cashOut} color="error" Icon={TrendingDownIcon} sign="-" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SummaryCard label="Expected Total" amount={summary.totals.expectedBalance} color="secondary" Icon={AccountBalanceWalletOutlinedIcon} sign="" />
            </Grid>
          </Grid>

          {/* Actions */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="info"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setMovementDialog({ open: true, type: 'CASH_IN' })}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3, py: 1.2 }}
            >
              Cash In
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RemoveCircleOutlineIcon />}
              onClick={() => setMovementDialog({ open: true, type: 'CASH_OUT' })}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3, py: 1.2 }}
            >
              Cash Out
            </Button>
          </Stack>

          {/* Transaction list */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={800}>
                Today's Transactions ({summary.transactions.length})
              </Typography>
            </Box>
            {summary.transactions.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary" variant="body2">No transactions yet</Typography>
                <Typography color="text.disabled" variant="caption">Transactions will appear here automatically</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Reference</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.transactions.map(tx => {
                      const cfg = TX_CONFIG[tx.type];
                      return (
                        <TableRow key={tx._id} hover>
                          <TableCell>
                            <Chip
                              icon={<cfg.Icon sx={{ fontSize: '0.8rem !important' }} />}
                              label={cfg.label}
                              size="small"
                              color={cfg.color}
                              sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 200 }} noWrap>
                              {tx.description || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">{tx.reference || '—'}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={800} color={`${cfg.color}.main`}>
                              {cfg.sign}{formatAmountWithComma(tx.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {tx.createdBy?.name || tx.createdBy?.username || '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      )}

      {/* ── Dialogs ── */}
      <OpenSessionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onOpen={handleOpenSession}
      />
      <CashMovementDialog
        open={movementDialog.open}
        type={movementDialog.type}
        sessionId={activeSession?._id}
        onClose={() => setMovementDialog({ open: false, type: '' })}
        onDone={handleMovementDone}
      />
      <CloseSessionDialog
        open={closeDialog}
        session={activeSession}
        totals={summary?.totals}
        onClose={() => setCloseDialog(false)}
        onClosed={handleClosed}
      />
      <SessionHistoryDialog
        open={historyDialog}
        onClose={() => setHistoryDialog(false)}
      />
    </Box>
  );
};

export default CashManagement;

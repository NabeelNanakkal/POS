import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Stack, Grid, Card, CardContent,
  Button, TextField, MenuItem, Divider, Skeleton, Tooltip,
  CircularProgress, Alert, Chip, IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  IconCalendar, IconRefresh, IconBrandWhatsapp, IconDownload,
  IconTrendingUp, IconTrendingDown, IconCash, IconCreditCard,
  IconArrowBack, IconArrowForward, IconCircleCheck, IconInfoCircle,
  IconReceipt, IconShoppingCart, IconCurrencyRupee, IconChartBar,
} from '@tabler/icons-react';
import dailySummaryService from 'services/dailySummary.service';
import MainCard from 'components/cards/MainCard';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#e8573e',
  primaryBg: '#fdf2f0',
  success:   '#06a046',
  successBg: '#f0faf4',
  warning:   '#d97706',
  warningBg: '#fffbeb',
  error:     '#f44336',
  errorBg:   '#fff5f5',
  info:      '#1976d2',
  infoBg:    '#f0f7ff',
  purple:    '#7c3aed',
  purpleBg:  '#f5f3ff',
  text:      '#121926',
  muted:     '#697586',
  dim:       '#9aa4b2',
  border:    '#e3e8ef',
  bg:        '#f8fafc',
  surface:   '#ffffff',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

const fmtCompact = (n = 0) =>
  `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)}`;

const todayIST = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + 330 * 60 * 1000);
  return ist.toISOString().split('T')[0];
};

const fmtDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
};

const shiftDate = (dateStr, days) => {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, color, Icon, loading }) => (
  <Card elevation={0} sx={{
    border: `1px solid ${C.border}`, borderRadius: '12px', height: '100%',
    overflow: 'hidden', position: 'relative',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: `0 4px 20px rgba(18,25,38,0.08)` },
  }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />
    <CardContent sx={{ p: 2.5, pt: 3, '&:last-child': { pb: 2.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>
            {label}
          </Typography>
          {loading ? (
            <>
              <Skeleton width={100} height={34} sx={{ borderRadius: 1 }} />
              <Skeleton width={70}  height={18} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, lineHeight: 1.1, mb: 0.5 }}>
                {value}
              </Typography>
              {sub && <Typography sx={{ fontSize: '0.72rem', color: C.muted }}>{sub}</Typography>}
            </>
          )}
        </Box>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px', flexShrink: 0, ml: 1,
          bgcolor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// ── Summary Row ───────────────────────────────────────────────────────────────
const SummaryRow = ({ label, value, color, bold, indent, dividerBefore, loading }) => (
  <>
    {dividerBefore && <Divider sx={{ borderColor: C.border, my: 0.5 }} />}
    <Stack direction="row" justifyContent="space-between" alignItems="center"
      sx={{ py: 0.9, pl: indent ? 2 : 0 }}>
      <Typography sx={{ fontSize: indent ? '0.82rem' : '0.85rem', color: indent ? C.muted : C.text, fontWeight: bold ? 700 : 400 }}>
        {label}
      </Typography>
      {loading
        ? <Skeleton width={90} height={20} sx={{ borderRadius: 1 }} />
        : (
          <Typography sx={{ fontSize: bold ? '0.95rem' : '0.85rem', fontWeight: bold ? 800 : 600, color: color || C.text }}>
            {value}
          </Typography>
        )
      }
    </Stack>
  </>
);

// ── Payment Mode Badge ────────────────────────────────────────────────────────
const MethodBadge = ({ method, amount }) => {
  const META = {
    CASH:    { label: 'Cash',    color: C.success, bg: C.successBg },
    CARD:    { label: 'Card',    color: C.info,    bg: C.infoBg    },
    UPI:     { label: 'UPI',     color: C.purple,  bg: C.purpleBg  },
    DIGITAL: { label: 'Digital', color: C.info,    bg: C.infoBg    },
    WALLET:  { label: 'Wallet',  color: C.warning, bg: C.warningBg },
    OTHER:   { label: 'Other',   color: C.muted,   bg: C.bg        },
  };
  const m = META[method?.toUpperCase()] || META.OTHER;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center"
      sx={{ px: 1.5, py: 0.9, borderRadius: '8px', bgcolor: m.bg, border: `1px solid ${m.color}25` }}>
      <Box component="span" sx={{
        fontSize: '0.72rem', fontWeight: 700, color: m.color,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {m.label}
      </Box>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: C.text }}>
        {fmt(amount)}
      </Typography>
    </Stack>
  );
};

// ── WhatsApp Preview ──────────────────────────────────────────────────────────
const WhatsAppPreview = ({ summary, date }) => {
  if (!summary) return null;

  const dateLabel = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const f = (n) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)}`;
  const lines = [
    `📊 Daily Store Report — ${dateLabel}`,
    '',
    `🏪 *${summary.storeName}*`,
    `  Sales: ${f(summary.totalSales)}  (${summary.totalOrders} orders)`,
    `  Cash: ${f(summary.cashSales)}  |  UPI/Card: ${f(summary.digitalSales)}`,
    summary.refundAmount > 0 ? `  Refunds: ${f(summary.refundAmount)}` : null,
    `  Purchases: ${f(summary.totalPurchase)}`,
    summary.totalExpense > 0 ? `  Expenses: ${f(summary.totalExpense)}` : null,
    `  *Net Profit: ${f(summary.netProfit)}*`,
  ].filter(Boolean);

  return (
    <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`, bgcolor: '#e7f8ee', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: '#25d366' }} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>WhatsApp Preview</Typography>
        <Chip label="Coming Soon" size="small" sx={{ ml: 'auto', height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fef3c7', color: '#92400e' }} />
      </Box>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{
          bgcolor: '#e7f8ee', borderRadius: '12px 12px 12px 2px',
          p: 1.5, maxWidth: 300,
          fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.6,
          color: C.text, whiteSpace: 'pre-wrap',
          border: `1px solid #b7e4c7`,
        }}>
          {lines.join('\n')}
        </Box>
        <Typography sx={{ fontSize: '0.68rem', color: C.dim, mt: 1.5 }}>
          This message will be sent automatically at the configured time once WhatsApp integration is enabled.
        </Typography>
      </CardContent>
    </Card>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const DailySummary = () => {
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [date,     setDate]     = useState(todayIST);
  const [storeId,  setStoreId]  = useState('');
  const [stores,   setStores]   = useState([]);
  const [summary,  setSummary]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  // Load store list for SUPER_ADMIN dropdown
  useEffect(() => {
    if (!isSuperAdmin) return;
    dailySummaryService.getStores()
      .then((res) => {
        setStores(res.data || []);
        if (res.data?.length) setStoreId(res.data[0]._id);
      })
      .catch(() => toast.error('Failed to load stores'));
  }, [isSuperAdmin]);

  const load = useCallback(async () => {
    if (isSuperAdmin && !storeId) return;
    setLoading(true);
    try {
      const params = { date };
      if (isSuperAdmin && storeId) params.storeId = storeId;
      const res = await dailySummaryService.getSummary(params);
      setSummary(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, [date, storeId, isSuperAdmin]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const params = { date };
      if (isSuperAdmin && storeId) params.storeId = storeId;
      await dailySummaryService.saveSummary(params);
      toast.success('Summary snapshot saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isToday = date === todayIST();

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: C.text }}>Daily Store Summary</Typography>
          <Box sx={{ px: 1.25, py: 0.3, borderRadius: '6px', bgcolor: C.primaryBg, color: C.primary, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${C.primary}30` }}>
            Live Report
          </Box>
        </Stack>
      }
    >
      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3, p: 2, bgcolor: C.bg, borderRadius: '10px', border: `1px solid ${C.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {/* Date navigation */}
            <Stack direction="row" alignItems="center" spacing={0.5}
              sx={{ borderRadius: '8px', border: `1px solid ${C.border}`, bgcolor: C.surface, overflow: 'hidden' }}>
              <IconButton size="small" onClick={() => setDate(shiftDate(date, -1))} sx={{ borderRadius: 0, px: 1 }}>
                <IconArrowBack size={15} color={C.muted} />
              </IconButton>
              <TextField
                type="date"
                size="small"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                inputProps={{ max: todayIST() }}
                sx={{
                  width: 155,
                  '& .MuiOutlinedInput-root': { borderRadius: 0, '& fieldset': { border: 'none' } },
                  '& input': { py: 0.85, fontSize: '0.85rem', fontWeight: 600 },
                }}
              />
              <IconButton size="small" onClick={() => setDate(shiftDate(date, 1))} disabled={isToday} sx={{ borderRadius: 0, px: 1 }}>
                <IconArrowForward size={15} color={isToday ? C.dim : C.muted} />
              </IconButton>
            </Stack>

            {!isToday && (
              <Button size="small" onClick={() => setDate(todayIST())}
                sx={{ borderRadius: '8px', textTransform: 'none', fontSize: '0.78rem', fontWeight: 600, color: C.muted, border: `1px solid ${C.border}`, bgcolor: C.surface, '&:hover': { borderColor: C.primary, color: C.primary } }}>
                Today
              </Button>
            )}

            {isSuperAdmin && stores.length > 0 && (
              <TextField
                select size="small" value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: C.surface } }}
              >
                {stores.map((s) => (
                  <MenuItem key={s._id} value={s._id}>{s.name} ({s.code})</MenuItem>
                ))}
              </TextField>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh summary">
              <Button
                size="small" variant="outlined" onClick={load} disabled={loading}
                startIcon={loading ? <CircularProgress size={12} /> : <IconRefresh size={14} />}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', borderColor: C.border, color: C.text, '&:hover': { borderColor: C.primary, color: C.primary, bgcolor: C.primaryBg } }}
              >
                Refresh
              </Button>
            </Tooltip>

            <Tooltip title="Save a snapshot of today's summary to database">
              <Button
                size="small" variant="outlined" onClick={handleSave} disabled={saving || loading}
                startIcon={saving ? <CircularProgress size={12} /> : <IconDownload size={14} />}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', borderColor: C.border, color: C.text, '&:hover': { borderColor: C.info, color: C.info, bgcolor: C.infoBg } }}
              >
                Save Snapshot
              </Button>
            </Tooltip>

            <Tooltip title="WhatsApp integration coming soon — configure in Settings → Notification Settings">
              <span>
                <Button
                  size="small" variant="outlined" disabled
                  startIcon={<IconBrandWhatsapp size={14} />}
                  sx={{
                    borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                    borderColor: '#25d36640', color: '#25d366',
                    '&.Mui-disabled': { borderColor: '#25d36630', color: '#25d36680' },
                  }}
                >
                  Send to Owner
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* ── Date Title ─────────────────────────────────────────────────────── */}
      {summary && !loading && (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <IconCalendar size={18} color={C.muted} />
          <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>
            {fmtDisplayDate(date)}
          </Typography>
          {summary.storeName && (
            <>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: C.dim }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: C.text }}>{summary.storeName}</Typography>
            </>
          )}
        </Stack>
      )}

      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Sales',   value: fmt(summary?.totalSales),   sub: `${summary?.totalOrders || 0} orders`,           color: C.primary,  Icon: IconTrendingUp       },
          { label: 'Cash Sales',    value: fmt(summary?.cashSales),    sub: 'Physical cash received',                        color: C.success,  Icon: IconCash             },
          { label: 'UPI / Card',    value: fmt(summary?.digitalSales), sub: 'Digital payments',                              color: C.purple,   Icon: IconCreditCard       },
          { label: 'Net Profit',    value: fmt(summary?.netProfit),    sub: 'Sales − Refunds − Purchase − Expenses',         color: (summary?.netProfit || 0) >= 0 ? C.success : C.error, Icon: IconChartBar },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <KpiCard {...k} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* ── Detail + WhatsApp Preview ─────────────────────────────────────── */}
      <Grid container spacing={2.5}>

        {/* Detailed Summary Card */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
            {/* Card header */}
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, borderBottom: `1px solid ${C.border}`, bgcolor: C.primaryBg, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.primary }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>
                {loading ? <Skeleton width={160} /> : (summary?.storeName || 'Store Summary')}
              </Typography>
              {summary && !loading && (
                <Typography sx={{ ml: 'auto', fontSize: '0.75rem', color: C.muted }}>
                  {fmtDisplayDate(date).split(',').slice(0, 2).join(',')}
                </Typography>
              )}
            </Box>

            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              {/* Revenue section */}
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                Revenue
              </Typography>
              <SummaryRow label="Total Sales"   value={fmt(summary?.totalSales)}  color={C.text}    bold    loading={loading} />
              <SummaryRow label="Total Orders"  value={`${summary?.totalOrders || 0} orders`}       loading={loading} />
              <SummaryRow label="Cash"          value={fmt(summary?.cashSales)}                    indent loading={loading} />
              <SummaryRow label="UPI / Card"    value={fmt(summary?.digitalSales)}                 indent loading={loading} />
              <SummaryRow label="Refunds"       value={`−${fmt(summary?.refundAmount)}`} color={(summary?.refundAmount || 0) > 0 ? C.error : C.dim}
                dividerBefore loading={loading} />

              {/* Cost section */}
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5, mt: 2 }}>
                Costs
              </Typography>
              <SummaryRow label="Total Purchase" value={`−${fmt(summary?.totalPurchase)}`} color={C.warning} loading={loading} />
              <SummaryRow label="Expenses"        value={`−${fmt(summary?.totalExpense)}`}  color={C.error}   loading={loading} />

              {/* Profit */}
              <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '10px', bgcolor: (summary?.netProfit || 0) >= 0 ? C.successBg : C.errorBg, border: `1px solid ${(summary?.netProfit || 0) >= 0 ? C.success : C.error}25` }}>
                <SummaryRow
                  label="Net Profit"
                  value={fmt(summary?.netProfit)}
                  color={(summary?.netProfit || 0) >= 0 ? C.success : C.error}
                  bold
                  loading={loading}
                />
                <Typography sx={{ fontSize: '0.68rem', color: C.muted }}>
                  = Sales − Refunds − Purchases − Expenses
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2} sx={{ height: '100%' }}>

            {/* Payment mode breakdown */}
            {(summary?.paymentBreakdown?.length > 0 || loading) && (
              <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.info }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>Payment Modes</Typography>
                </Box>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {loading ? (
                    <Stack spacing={1}>
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height={40} sx={{ borderRadius: '8px' }} />
                      ))}
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      {summary.paymentBreakdown.map((p) => (
                        <MethodBadge key={p.method} method={p.method} amount={p.amount} />
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            )}

            {/* WhatsApp preview */}
            {summary && !loading && <WhatsAppPreview summary={summary} date={date} />}

            {/* Info notice */}
            {!loading && (
              <Alert
                icon={<IconInfoCircle size={16} />}
                severity="info"
                sx={{ borderRadius: '10px', fontSize: '0.75rem', '& .MuiAlert-icon': { pt: 0.25 } }}
              >
                <strong>Purchase data</strong> is pulled from Zoho Books (if connected).
                <br />
                <strong>Expenses</strong> come from Cash Management CASH_OUT transactions.
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && summary && summary.totalOrders === 0 && (
        <Box sx={{ mt: 2, p: 2.5, bgcolor: C.bg, borderRadius: '10px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: C.muted }}>
            No orders found for this date. The summary shows ₹0 values.
          </Typography>
        </Box>
      )}
    </MainCard>
  );
};

export default DailySummary;

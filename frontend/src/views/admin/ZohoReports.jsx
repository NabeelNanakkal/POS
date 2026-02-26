import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Stack, Grid, Card, CardContent, Chip,
  Button, Tab, Tabs, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, MenuItem, CircularProgress, Alert, Divider, Tooltip,
  IconButton, Skeleton,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  IconRefresh, IconCloudDownload, IconTrendingUp, IconTrendingDown,
  IconCurrencyRupee, IconChartBar, IconCreditCard, IconAlertTriangle,
  IconExternalLink, IconChevronLeft, IconChevronRight,
  IconCircleCheck, IconCircleX, IconClock, IconCash,
  IconBuildingBank, IconDeviceMobile, IconCategory,
} from '@tabler/icons-react';
import zohoReportService from 'services/zohoReport.service';
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
  text:      '#121926',
  muted:     '#697586',
  dim:       '#9aa4b2',
  border:    '#e3e8ef',
  bg:        '#f8fafc',
  surface:   '#ffffff',
};

const ROLE_ACCENT = {
  sales:     C.primary,
  purchases: C.warning,
  profit:    C.success,
  tax:       C.info,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

const fmtNum = (n = 0) => new Intl.NumberFormat('en-IN').format(n);

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtRelative = (d) => {
  if (!d) return 'Never';
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return fmtDate(d);
};

const STATUS_META = {
  paid:           { label: 'Paid',          color: C.success, bg: C.successBg },
  partially_paid: { label: 'Partial',        color: '#92400e', bg: '#fef3c7' },
  overdue:        { label: 'Overdue',        color: C.error,   bg: C.errorBg  },
  sent:           { label: 'Sent',           color: C.info,    bg: C.infoBg   },
  draft:          { label: 'Draft',          color: C.muted,   bg: C.bg       },
  open:           { label: 'Open',           color: C.info,    bg: C.infoBg   },
  void:           { label: 'Void',           color: C.dim,     bg: '#f1f5f9'  },
};

const MODE_META = {
  cash:         { label: 'Cash',          color: C.success, bg: C.successBg, Icon: IconCash           },
  creditcard:   { label: 'Card',          color: C.info,    bg: C.infoBg,    Icon: IconCreditCard      },
  banktransfer: { label: 'Bank Transfer', color: C.warning, bg: C.warningBg, Icon: IconBuildingBank    },
  upi:          { label: 'UPI',           color: '#7c3aed', bg: '#f5f3ff',   Icon: IconDeviceMobile    },
  others:       { label: 'Others',        color: C.dim,     bg: C.bg,        Icon: IconCategory        },
};

const defaultRange = () => {
  const end   = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate:   end.toISOString().split('T')[0],
  };
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || { label: status, color: C.muted, bg: C.bg };
  return (
    <Box component="span" sx={{
      display: 'inline-flex', alignItems: 'center',
      px: 1.25, py: 0.3, borderRadius: '6px',
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
      color: m.color, bgcolor: m.bg,
      border: `1px solid ${m.color}30`,
      textTransform: 'uppercase',
    }}>
      {m.label}
    </Box>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, color = C.primary, loading, trend }) => (
  <Card elevation={0} sx={{
    borderRadius: '12px',
    border: `1px solid ${C.border}`,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: `0 4px 20px rgba(18,25,38,0.08)` },
  }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />
    <CardContent sx={{ p: 2.5, pt: 3, '&:last-child': { pb: 2.5 } }}>
      <Typography sx={{
        fontSize: '0.68rem', fontWeight: 700, color: C.muted,
        textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1,
      }}>
        {label}
      </Typography>
      {loading ? (
        <>
          <Skeleton variant="text" width={120} height={38} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ borderRadius: 1 }} />
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: C.text, lineHeight: 1.1, mb: 0.5 }}>
            {value}
          </Typography>
          {sub && (
            <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>
              {sub}
            </Typography>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

// ── Sync Status Pill ──────────────────────────────────────────────────────────
const SyncBar = ({ syncStatus, onSync, syncing }) => {
  const last     = syncStatus?.lastSync;
  const counts   = syncStatus?.counts || {};
  const isRunning = last?.status === 'running';
  const isFailed  = last?.status === 'failed';

  const statusColor = isRunning ? C.warning : isFailed ? C.error : last?.status === 'success' ? C.success : C.dim;
  const StatusIcon  = isRunning ? IconClock  : isFailed ? IconCircleX : last?.status === 'success' ? IconCircleCheck : IconClock;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={2} flexWrap="wrap">
      {/* Status pill */}
      <Stack direction="row" spacing={1} alignItems="center"
        sx={{ px: 1.5, py: 0.75, borderRadius: '8px', bgcolor: `${statusColor}12`, border: `1px solid ${statusColor}30` }}>
        {isRunning
          ? <CircularProgress size={12} sx={{ color: statusColor }} />
          : <StatusIcon size={13} color={statusColor} />
        }
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor }}>
          {isRunning ? 'Syncing now…' : isFailed ? 'Last sync failed' : `Synced ${fmtRelative(last?.completedAt)}`}
        </Typography>
      </Stack>

      {/* Counts */}
      <Stack direction="row" spacing={2} divider={<Box sx={{ width: 1, bgcolor: C.border }} />}>
        {[
          { label: 'Invoices', val: counts.sales     },
          { label: 'Bills',    val: counts.purchases },
          { label: 'Payments', val: counts.payments  },
        ].map(({ label, val }) => (
          <Box key={label}>
            <Typography sx={{ fontSize: '0.62rem', color: C.dim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: C.text }}>
              {fmtNum(val || 0)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" spacing={1}>
        <Tooltip title="Incremental sync (last 25 hours)">
          <Button
            size="small"
            variant="outlined"
            startIcon={syncing ? <CircularProgress size={12} /> : <IconRefresh size={14} />}
            onClick={() => onSync(false)}
            disabled={syncing || isRunning}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontWeight: 600,
              fontSize: '0.78rem', borderColor: C.border, color: C.text,
              '&:hover': { borderColor: C.primary, color: C.primary, bgcolor: C.primaryBg },
            }}
          >
            Sync
          </Button>
        </Tooltip>
        <Tooltip title="Full sync (last 6 months) — takes longer">
          <Button
            size="small"
            variant="outlined"
            startIcon={<IconCloudDownload size={14} />}
            onClick={() => onSync(true)}
            disabled={syncing || isRunning}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontWeight: 600,
              fontSize: '0.78rem', borderColor: C.warning + '80', color: C.warning,
              '&:hover': { borderColor: C.warning, bgcolor: C.warningBg },
            }}
          >
            Full Sync
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

// ── Filter Row ────────────────────────────────────────────────────────────────
const FilterRow = ({ filters, onChange, showStatus = false }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
    <TextField
      label="From"
      type="date"
      size="small"
      value={filters.startDate}
      onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    />
    <TextField
      label="To"
      type="date"
      size="small"
      value={filters.endDate}
      onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    />
    {showStatus && (
      <TextField
        select
        label="Status"
        size="small"
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        sx={{ width: 155, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      >
        {[
          { value: '',               label: 'All Statuses' },
          { value: 'paid',           label: 'Paid'         },
          { value: 'partially_paid', label: 'Partial'      },
          { value: 'overdue',        label: 'Overdue'      },
          { value: 'sent',           label: 'Sent'         },
          { value: 'draft',          label: 'Draft'        },
          { value: 'open',           label: 'Open'         },
        ].map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </TextField>
    )}
  </Stack>
);

// ── Totals Strip ──────────────────────────────────────────────────────────────
const TotalsStrip = ({ items, loading, accentColor = C.primary }) => (
  <Box sx={{
    display: 'flex', flexWrap: 'wrap', gap: 0,
    borderRadius: '10px', border: `1px solid ${C.border}`,
    overflow: 'hidden', bgcolor: C.surface, mb: 2.5,
  }}>
    {items.map(({ label, value, color }, i) => (
      <Box key={label} sx={{
        px: 2.5, py: 1.5,
        borderRight: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
        minWidth: 100,
        '&:first-of-type': { borderLeft: `3px solid ${accentColor}` },
      }}>
        <Typography sx={{ fontSize: '0.62rem', color: C.dim, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.25 }}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={70} height={20} sx={{ borderRadius: 1 }} />
        ) : (
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: color || C.text }}>
            {value}
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);

// ── Table Header Cell ─────────────────────────────────────────────────────────
const TH = ({ children, align = 'left' }) => (
  <TableCell align={align} sx={{
    fontSize: '0.68rem', fontWeight: 700, color: C.muted,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    whiteSpace: 'nowrap', py: 1.25, bgcolor: C.bg,
    borderBottom: `2px solid ${C.border}`,
  }}>
    {children}
  </TableCell>
);

// ── Table Data Cell ───────────────────────────────────────────────────────────
const TD = ({ children, sx = {} }) => (
  <TableCell sx={{ fontSize: '0.82rem', color: C.text, py: 1.1, ...sx }}>
    {children}
  </TableCell>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, total, onChange }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end"
    sx={{ pt: 1.5, borderTop: `1px solid ${C.border}`, mt: 0.5 }}>
    <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>
      Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
      {total != null && <> · {fmtNum(total)} total</>}
    </Typography>
    <Stack direction="row" spacing={0.5}>
      <IconButton size="small" disabled={page <= 1} onClick={() => onChange(page - 1)}
        sx={{ borderRadius: '6px', border: `1px solid ${C.border}`, color: C.muted, '&:not(:disabled):hover': { bgcolor: C.primaryBg, borderColor: C.primary, color: C.primary } }}>
        <IconChevronLeft size={15} />
      </IconButton>
      <IconButton size="small" disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        sx={{ borderRadius: '6px', border: `1px solid ${C.border}`, color: C.muted, '&:not(:disabled):hover': { bgcolor: C.primaryBg, borderColor: C.primary, color: C.primary } }}>
        <IconChevronRight size={15} />
      </IconButton>
    </Stack>
  </Stack>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <Box sx={{ py: 6, textAlign: 'center' }}>
    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: C.bg, border: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
      <IconChartBar size={22} color={C.dim} />
    </Box>
    <Typography sx={{ fontSize: '0.85rem', color: C.muted }}>{message}</Typography>
  </Box>
);

// ── Summary Tab ───────────────────────────────────────────────────────────────
const SummaryTab = ({ data, loading }) => {
  const s      = data?.sales     || {};
  const p      = data?.purchases || {};
  const profit = data?.profit    || 0;

  const breakdownRows = (items) => items.map(({ label, value, color }) => (
    <Stack key={label} direction="row" justifyContent="space-between" alignItems="center"
      sx={{ py: 1.1, borderBottom: `1px solid ${C.border}`, '&:last-child': { borderBottom: 'none' } }}>
      <Typography sx={{ fontSize: '0.82rem', color: C.muted }}>{label}</Typography>
      {loading
        ? <Skeleton width={90} height={20} sx={{ borderRadius: 1 }} />
        : <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: color || C.text }}>{value}</Typography>}
    </Stack>
  ));

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Sales',     value: fmt(s.totalSales),     sub: `${fmtNum(s.count || 0)} invoices`,  color: C.primary  },
          { label: 'Total Purchases', value: fmt(p.totalPurchases), sub: `${fmtNum(p.count || 0)} bills`,     color: C.warning  },
          { label: 'Net Profit',      value: fmt(profit),           sub: 'Sales − Purchases',                 color: profit >= 0 ? C.success : C.error },
          { label: 'Tax Collected',   value: fmt(s.totalTax),       sub: `Discount ${fmt(s.totalDiscount)}`,  color: C.info     },
        ].map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <KpiCard {...kpi} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`,
              bgcolor: C.primaryBg, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.primary }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>Sales Breakdown</Typography>
            </Box>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              {breakdownRows([
                { label: 'Total Sales',    value: fmt(s.totalSales),    color: C.text    },
                { label: 'Paid Amount',    value: fmt(s.totalPaid),     color: C.success },
                { label: 'Unpaid Amount',  value: fmt(s.totalUnpaid),   color: C.error   },
                { label: 'Tax Collected',  value: fmt(s.totalTax),      color: C.info    },
                { label: 'Discount Given', value: fmt(s.totalDiscount), color: C.warning },
              ])}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`,
              bgcolor: C.warningBg, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.warning }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>Purchase Breakdown</Typography>
            </Box>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              {breakdownRows([
                { label: 'Total Purchases', value: fmt(p.totalPurchases), color: C.text    },
                { label: 'Paid Amount',     value: fmt(p.totalPaid),      color: C.success },
                { label: 'Unpaid Amount',   value: fmt(p.totalUnpaid),    color: C.error   },
              ])}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// ── Sales Tab ─────────────────────────────────────────────────────────────────
const SalesTab = ({ filters, onFilterChange }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(1);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await zohoReportService.getSales({ ...filters, page: p, limit: 20 });
      setData(res.data);
    } catch {
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { setPage(1); load(1); }, [load]);

  const handlePage = (p) => { setPage(p); load(p); };
  const totals = data?.totals || {};

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <FilterRow filters={{ ...filters, status: filters.status || '' }} onChange={onFilterChange} showStatus />
      </Stack>

      <TotalsStrip
        loading={loading && !data}
        accentColor={C.primary}
        items={[
          { label: 'Total',    value: fmt(totals.totalSales),    color: C.text    },
          { label: 'Paid',     value: fmt(totals.totalPaid),     color: C.success },
          { label: 'Unpaid',   value: fmt(totals.totalUnpaid),   color: C.error   },
          { label: 'Tax',      value: fmt(totals.totalTax),      color: C.info    },
          { label: 'Discount', value: fmt(totals.totalDiscount), color: C.warning },
          { label: 'Records',  value: fmtNum(totals.count),      color: C.muted   },
        ]}
      />

      <Box sx={{ overflowX: 'auto', borderRadius: '10px', border: `1px solid ${C.border}` }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Invoice #', 'Date', 'Customer', 'Reference', 'Sub Total', 'Tax', 'Discount', 'Total', 'Balance', 'Status'].map(h => (
                <TH key={h}>{h}</TH>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !data ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j} sx={{ py: 1.1 }}><Skeleton height={18} sx={{ borderRadius: 1 }} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.invoices?.length ? (
              <TableRow><TableCell colSpan={10}><EmptyState message="No sales data for the selected period" /></TableCell></TableRow>
            ) : (
              data.invoices.map((inv) => (
                <TableRow key={inv._id} sx={{ '&:hover': { bgcolor: C.bg } }}>
                  <TD sx={{ fontWeight: 700, color: C.primary }}>{inv.invoiceNumber || '—'}</TD>
                  <TD sx={{ whiteSpace: 'nowrap', color: C.muted }}>{fmtDate(inv.date)}</TD>
                  <TD sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {inv.customerName}
                  </TD>
                  <TD sx={{ color: C.dim, fontSize: '0.75rem' }}>{inv.referenceNumber || '—'}</TD>
                  <TD>{fmt(inv.subTotal)}</TD>
                  <TD sx={{ color: C.info }}>{fmt(inv.totalTax)}</TD>
                  <TD sx={{ color: C.warning }}>{fmt(inv.discount)}</TD>
                  <TD sx={{ fontWeight: 700 }}>{fmt(inv.total)}</TD>
                  <TD sx={{ fontWeight: 700, color: inv.balance > 0 ? C.error : C.success }}>{fmt(inv.balance)}</TD>
                  <TD><StatusBadge status={inv.status} /></TD>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} onChange={handlePage} />}
    </Box>
  );
};

// ── Purchases Tab ─────────────────────────────────────────────────────────────
const PurchasesTab = ({ filters, onFilterChange }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(1);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await zohoReportService.getPurchases({ ...filters, page: p, limit: 20 });
      setData(res.data);
    } catch {
      toast.error('Failed to load purchase data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { setPage(1); load(1); }, [load]);

  const handlePage = (p) => { setPage(p); load(p); };
  const totals = data?.totals || {};

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <FilterRow filters={{ ...filters, status: filters.status || '' }} onChange={onFilterChange} showStatus />
      </Stack>

      <TotalsStrip
        loading={loading && !data}
        accentColor={C.warning}
        items={[
          { label: 'Total',   value: fmt(totals.totalPurchases), color: C.text    },
          { label: 'Paid',    value: fmt(totals.totalPaid),      color: C.success },
          { label: 'Unpaid',  value: fmt(totals.totalUnpaid),    color: C.error   },
          { label: 'Tax',     value: fmt(totals.totalTax),       color: C.info    },
          { label: 'Records', value: fmtNum(totals.count),       color: C.muted   },
        ]}
      />

      <Box sx={{ overflowX: 'auto', borderRadius: '10px', border: `1px solid ${C.border}` }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Bill #', 'Date', 'Vendor', 'Sub Total', 'Tax', 'Total', 'Balance', 'Status'].map(h => (
                <TH key={h}>{h}</TH>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !data ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j} sx={{ py: 1.1 }}><Skeleton height={18} sx={{ borderRadius: 1 }} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.bills?.length ? (
              <TableRow><TableCell colSpan={8}><EmptyState message="No purchase data for the selected period" /></TableCell></TableRow>
            ) : (
              data.bills.map((bill) => (
                <TableRow key={bill._id} sx={{ '&:hover': { bgcolor: C.bg } }}>
                  <TD sx={{ fontWeight: 700, color: C.warning }}>{bill.billNumber || '—'}</TD>
                  <TD sx={{ whiteSpace: 'nowrap', color: C.muted }}>{fmtDate(bill.date)}</TD>
                  <TD sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {bill.vendorName || '—'}
                  </TD>
                  <TD>{fmt(bill.subTotal)}</TD>
                  <TD sx={{ color: C.info }}>{fmt(bill.totalTax)}</TD>
                  <TD sx={{ fontWeight: 700 }}>{fmt(bill.total)}</TD>
                  <TD sx={{ fontWeight: 700, color: bill.balance > 0 ? C.error : C.success }}>{fmt(bill.balance)}</TD>
                  <TD><StatusBadge status={bill.status} /></TD>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} onChange={handlePage} />}
    </Box>
  );
};

// ── Payments Tab ──────────────────────────────────────────────────────────────
const PaymentsTab = ({ filters }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await zohoReportService.getPayments(filters);
      setData(res.data);
    } catch {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const breakdown = data?.breakdown || [];
  const summary   = data?.summary   || {};

  return (
    <Box>
      {/* Summary KPI row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard label="Total Collected" value={fmt(summary.total)} sub={`${fmtNum(summary.count || 0)} payments`} color={C.success} loading={loading} />
        </Grid>
        {breakdown.slice(0, 3).map(({ _id, total, count }) => {
          const m = MODE_META[_id] || MODE_META.others;
          return (
            <Grid item xs={12} sm={6} md={3} key={_id}>
              <KpiCard label={m.label} value={fmt(total)} sub={`${fmtNum(count)} transactions`} color={m.color} loading={loading} />
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Breakdown card */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`,
              bgcolor: C.successBg, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.success }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>Payment Modes</Typography>
            </Box>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : !breakdown.length ? (
                <EmptyState message="No payment data" />
              ) : (
                <Stack spacing={2}>
                  {breakdown.map(({ _id, total, count }) => {
                    const pct = summary.total > 0 ? (total / summary.total) * 100 : 0;
                    const m   = MODE_META[_id] || MODE_META.others;
                    const Icon = m.Icon;
                    return (
                      <Box key={_id}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{
                              width: 28, height: 28, borderRadius: '7px',
                              bgcolor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: `1px solid ${m.color}30`,
                            }}>
                              <Icon size={14} color={m.color} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: C.text }}>{m.label}</Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: C.dim }}>{fmtNum(count)} txns</Typography>
                            </Box>
                          </Stack>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: C.text }}>{fmt(total)}</Typography>
                            <Typography sx={{ fontSize: '0.68rem', color: C.dim }}>{pct.toFixed(1)}%</Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ height: 5, borderRadius: 3, bgcolor: `${m.color}18`, overflow: 'hidden' }}>
                          <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: m.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                        </Box>
                      </Box>
                    );
                  })}

                  <Divider sx={{ borderColor: C.border }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: C.muted }}>Total Collected</Typography>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: C.success }}>{fmt(summary.total)}</Typography>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent payments */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1, borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.info }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>Recent Payments</Typography>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Date', 'Customer', 'Mode', 'Amount'].map(h => <TH key={h}>{h}</TH>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4].map(j => (
                          <TableCell key={j} sx={{ py: 1.1 }}><Skeleton height={18} sx={{ borderRadius: 1 }} /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : !data?.recent?.length ? (
                    <TableRow>
                      <TableCell colSpan={4}><EmptyState message="No payments found" /></TableCell>
                    </TableRow>
                  ) : (
                    data.recent.map((pmt) => {
                      const m = MODE_META[pmt.paymentMode] || MODE_META.others;
                      return (
                        <TableRow key={pmt._id} sx={{ '&:hover': { bgcolor: C.bg } }}>
                          <TD sx={{ whiteSpace: 'nowrap', color: C.muted }}>{fmtDate(pmt.date)}</TD>
                          <TD sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {pmt.customerName || '—'}
                          </TD>
                          <TD>
                            <Box component="span" sx={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              px: 1, py: 0.25, borderRadius: '6px',
                              bgcolor: m.bg, color: m.color,
                              fontSize: '0.72rem', fontWeight: 600,
                              border: `1px solid ${m.color}30`,
                            }}>
                              <m.Icon size={11} />
                              {m.label}
                            </Box>
                          </TD>
                          <TD sx={{ fontWeight: 700 }}>{fmt(pmt.amount)}</TD>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const TABS = [
  { label: 'Overview',         key: 'overview'   },
  { label: 'Sales Invoices',   key: 'sales'      },
  { label: 'Purchase Bills',   key: 'purchases'  },
  { label: 'Payment Analysis', key: 'payments'   },
];

const ZohoReports = () => {
  const [tab,        setTab]        = useState(0);
  const [filters,    setFilters]    = useState(defaultRange);
  const [summary,    setSummary]    = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loadSum,    setLoadSum]    = useState(false);
  const [syncing,    setSyncing]    = useState(false);
  const [connected,  setConnected]  = useState(true);

  const loadSyncStatus = useCallback(async () => {
    try {
      const res = await zohoReportService.getSyncStatus();
      setSyncStatus(res.data);
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        setConnected(false);
      }
    }
  }, []);

  const loadSummary = useCallback(async () => {
    setLoadSum(true);
    try {
      const res = await zohoReportService.getSummary(filters);
      setSummary(res.data);
    } catch {
      toast.error('Failed to load summary');
    } finally {
      setLoadSum(false);
    }
  }, [filters]);

  useEffect(() => { loadSyncStatus(); loadSummary(); }, [loadSyncStatus, loadSummary]);

  // Poll while sync is running
  useEffect(() => {
    if (syncStatus?.lastSync?.status !== 'running') return;
    const id = setInterval(loadSyncStatus, 4000);
    return () => clearInterval(id);
  }, [syncStatus, loadSyncStatus]);

  const handleSync = async (full) => {
    setSyncing(true);
    try {
      await zohoReportService.triggerSync(full);
      toast.success(full ? 'Full sync started — may take a few minutes' : 'Sync started');
      setTimeout(loadSyncStatus, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start sync');
    } finally {
      setSyncing(false);
    }
  };

  if (!connected) {
    return (
      <MainCard>
        <Stack alignItems="center" sx={{ py: 6, gap: 2 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            bgcolor: C.warningBg, border: `1px solid ${C.warning}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconAlertTriangle size={28} color={C.warning} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: C.text, mb: 0.5 }}>
              Zoho Books Not Connected
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: C.muted, mb: 2 }}>
              Connect your Zoho Books account in Settings → Integrations to view financial reports.
            </Typography>
            <Button
              variant="contained"
              href="/pos/settings/integrations"
              endIcon={<IconExternalLink size={15} />}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, bgcolor: C.primary, '&:hover': { bgcolor: '#d44b32' } }}
            >
              Connect Zoho Books
            </Button>
          </Box>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: C.text }}>
            Zoho Financial Reports
          </Typography>
          <Box sx={{
            px: 1.25, py: 0.3, borderRadius: '6px',
            bgcolor: C.infoBg, color: C.info,
            fontSize: '0.72rem', fontWeight: 700,
            border: `1px solid ${C.info}30`,
          }}>
            Zoho Books
          </Box>
        </Stack>
      }
    >
      {/* Sync bar */}
      <Box sx={{
        mb: 2.5, px: 2, py: 1.5,
        borderRadius: '10px', border: `1px solid ${C.border}`,
        bgcolor: C.bg,
      }}>
        <SyncBar syncStatus={syncStatus} onSync={handleSync} syncing={syncing} />
      </Box>

      {/* Filters — only show on Overview tab */}
      {tab === 0 && (
        <Box sx={{ mb: 2.5 }}>
          <FilterRow filters={{ ...filters, status: filters.status || '' }} onChange={setFilters} />
        </Box>
      )}

      {/* Tab navigation */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2.5,
          minHeight: 40,
          borderBottom: `2px solid ${C.border}`,
          '& .MuiTabs-indicator': { bgcolor: C.primary, height: 2 },
          '& .MuiTab-root': {
            textTransform: 'none', fontWeight: 500, fontSize: '0.875rem',
            minWidth: 0, px: 2, minHeight: 40, color: C.muted,
            '&.Mui-selected': { fontWeight: 700, color: C.primary },
          },
        }}
      >
        {TABS.map(t => <Tab key={t.key} label={t.label} />)}
      </Tabs>

      {/* Tab panels */}
      {tab === 0 && <SummaryTab data={summary} loading={loadSum} />}
      {tab === 1 && <SalesTab    filters={filters} onFilterChange={setFilters} />}
      {tab === 2 && <PurchasesTab filters={filters} onFilterChange={setFilters} />}
      {tab === 3 && <PaymentsTab  filters={filters} />}
    </MainCard>
  );
};

export default ZohoReports;

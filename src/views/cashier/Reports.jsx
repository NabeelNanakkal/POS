import React from 'react';
import { 
    Box, 
    Typography, 
    Stack, 
    Button, 
    Paper, 
    Avatar, 
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    InputAdornment,
    TextField,
    alpha,
    useTheme,
    CircularProgress,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesReport } from 'container/ReportContainer/slice';
import { fetchStores } from 'container/StoreContainer/slice';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';

import { formatAmountWithComma, getCurrencySymbol } from 'utils/formatAmount';
import NoDataLottie from 'ui-component/NoDataLottie';

// Helper for Simple Table
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

// Custom Components
const KPICard = ({ title, value, subtitle, trend, trendValue, color }) => {
    const theme = useTheme();
    const isPositive = trend === 'up';
    
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                borderRadius: 5, 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 32px rgba(0,0,0,0.06)', borderColor: alpha(theme.palette[color].main, 0.3) }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
                        {title}
                    </Typography>
                    <Typography variant="h2" fontWeight={900} sx={{ mt: 0.5, color: 'text.primary' }}>{value}</Typography>
                </Box>
                <Chip 
                    icon={isPositive ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
                    label={trendValue}
                    size="small"
                    sx={{ 
                        fontWeight: 900, 
                        fontSize: '0.7rem',
                        bgcolor: isPositive ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: isPositive ? 'success.main' : 'error.main',
                        borderRadius: 2,
                        px: 0.5,
                        '& .MuiChip-icon': { color: 'inherit' }
                    }}
                />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isPositive ? 'success.main' : 'error.main' }} />
                {subtitle}
            </Typography>
        </Paper>
    );
};

const Reports = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { user: reduxUser } = useSelector((state) => state.login);
    const { salesReport, loading } = useSelector((state) => state.report);
    const { stores } = useSelector((state) => state.store);
    
    // Get user from Redux or fallback to localStorage
    const storageUser = JSON.parse(localStorage.getItem('user') || '{}');
    const user = reduxUser || storageUser;
    
    // Robust role check (case-insensitive)
    const userRole = user?.role?.toUpperCase() || '';
    const isAnyAdmin = userRole === 'SUPER_ADMIN' || userRole === 'STORE_ADMIN' || userRole === 'TENANTADMIN';

    const [dateRange, setDateRange] = React.useState('this-week');
    const [selectedStore, setSelectedStore] = React.useState('all');

    // Sync selectedStore only if NOT an admin (or if we want to default to 'all' for admins)
    React.useEffect(() => {
        if (user && !isAnyAdmin) {
            // If not an Admin, lock to user's store
            const userStoreId = user?.store?._id || user?.store?.id || user?.store;
            if (userStoreId) {
                setSelectedStore(userStoreId);
            }
        }
    }, [user, isAnyAdmin]);
    
    // Pagination state
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Modal state
    const [selectedTrx, setSelectedTrx] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleRowClick = (trx) => {
        setSelectedTrx(trx);
        setIsModalOpen(true);
    };

    // Fetch stores on mount for all Admins
    React.useEffect(() => {
        if (isAnyAdmin) {
            dispatch(fetchStores());
        }
    }, [dispatch, isAnyAdmin]);

    // Fetch report logic...
    React.useEffect(() => {
        dispatch(fetchSalesReport({ 
            period: dateRange, 
            storeId: selectedStore,
            page: page + 1,
            limit: rowsPerPage
        }));
    }, [dispatch, dateRange, selectedStore, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const stats = salesReport?.kpi || { totalRevenue: 0, transactions: 0, avgTicket: 0, netProfit: 0 };
    const trends = salesReport?.trends || [];
    const payments = salesReport?.payments || [];
    const recentData = salesReport?.recent?.data || [];
    const recentPagination = salesReport?.recent?.pagination || { total: 0 };

    const revenueChartOptions = {
        chart: {
            id: 'revenue-trends',
            toolbar: { show: false },
            fontFamily: 'inherit',
            sparkline: { enabled: false }
        },
        stroke: { curve: 'smooth', width: 3 },
        colors: [theme.palette.primary.main],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        xaxis: {
            categories: trends.map(t => dayjs(t._id).format('MMM DD')),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: theme.palette.text.secondary, fontWeight: 500 } }
        },
        yaxis: {
            labels: { 
                formatter: (val) => `${getCurrencySymbol()}${val}`,
                style: { colors: theme.palette.text.secondary, fontWeight: 500 }
            }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
            yaxis: { lines: { show: true } }
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' }
    };

    const revenueChartSeries = [{
        name: 'Revenue',
        data: trends.map(t => t.revenue)
    }];

    const paymentChartOptions = {
        chart: { type: 'donut' },
        labels: payments.map(p => p._id),
        colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
        legend: { position: 'bottom', fontWeight: 600 },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => `${getCurrencySymbol()}${(stats.totalRevenue / 1000).toFixed(1)}k`
                        }
                    }
                }
            }
        }
    };

    const paymentChartSeries = payments.map(p => p.count);

    return (
        <Box sx={{ 
            p: 4, 
            height: '100vh', 
            overflowY: 'auto', 
            bgcolor: '#f8fafc',
            backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
            m: -3,
            position: 'relative',
            '@media print': {
                p: 0,
                m: 0,
                height: 'auto',
                overflow: 'visible',
                bgcolor: 'white',
                backgroundImage: 'none',
                '& .no-print': { display: 'none !important' }
            }
        }}>
            {/* Print Styles */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #report-content, #report-content * {
                            visibility: visible;
                        }
                        #report-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            background: white;
                            z-index: 9999;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>

            {loading && (
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    bgcolor: 'rgba(248, 250, 252, 0.5)', 
                    zIndex: 10,
                    backdropFilter: 'blur(2px)'
                }}>
                    <CircularProgress color="primary" />
                </Box>
            )}
            
            {/* Report Content Wrapper for Print */}
            <Box id="report-content">
                {/* Top Bar - Filter Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
                    <Box>
                        {/* Filters allow printing current view, so we keep them or hide them? Usually hide filters on print. Let's start by keeping header but maybe hiding dropdown inputs if needed. For now, let's keep them visible as context. */}
                        <Stack direction="row" spacing={2} alignItems="center" className="no-print">
                            <Box sx={{ mt: 1 }}>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel id="date-range-label" sx={{ fontWeight: 700 }}>Date Range</InputLabel>
                                    <Select 
                                        labelId="date-range-label"
                                        label="Date Range"
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: theme.palette.primary.main, mr: 1 }} />
                                            </InputAdornment>
                                        }
                                        sx={{ bgcolor: 'white', borderRadius: 3, '& fieldset': { borderColor: '#e2e8f0' }, fontWeight: 700 }}
                                    >
                                        <MenuItem value="today">Today</MenuItem>
                                        <MenuItem value="this-week">This Week</MenuItem>
                                        <MenuItem value="this-month">This Month</MenuItem>
                                        <MenuItem value="this-year">This Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {isAnyAdmin && (
                                <Box sx={{ mt: 1 }}>
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <InputLabel id="store-label" sx={{ fontWeight: 700 }}>Store</InputLabel>
                                        <Select 
                                            labelId="store-label"
                                            label="Store"
                                            value={selectedStore}
                                            onChange={(e) => setSelectedStore(e.target.value)}
                                            sx={{ bgcolor: 'white', borderRadius: 3, '& fieldset': { borderColor: '#e2e8f0' }, fontWeight: 700 }}
                                        >
                                            <MenuItem value="all">All Stores</MenuItem>
                                            {stores.map(store => (
                                                <MenuItem key={store._id} value={store._id}>{store.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Box>

                {/* KPI Cards */}
                <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                        gap: 3, 
                        mb: 4 
                    }}
                >
                    <KPICard title="Total Revenue" value={formatAmountWithComma(stats.totalRevenue)} subtitle="Revenue for selected period" trend="up" trendValue="" color="success" />
                    <KPICard title="Transactions" value={stats.transactions} subtitle="Total orders processed" trend="up" trendValue="" color="success" />
                    <KPICard title="Avg. Ticket" value={formatAmountWithComma(stats.avgTicket)} subtitle="Average order value" trend={stats.avgTicket > 50 ? "up" : "down"} trendValue="" color={stats.avgTicket > 50 ? "success" : "warning"} />
                    <KPICard title="Net Profit" value={formatAmountWithComma(stats.netProfit)} subtitle="Revenue - Refunds" trend="up" trendValue="" color="success" />
                </Box>

                {/* Charts Row */}
                <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                        gap: 3, 
                        mb: 4 
                    }}
                >
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3.5, 
                            borderRadius: 6, 
                            border: '1px solid rgba(255, 255, 255, 0.3)', 
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px)',
                            gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' },
                            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
                        }}
                    >
                        <Box sx={{ height: 320 }}>
                            {trends.length > 0 ? (
                                <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height={320} />
                            ) : (
                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <NoDataLottie message="No revenue trends for this period" size="180px" />
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3.5, 
                            borderRadius: 6, 
                            border: '1px solid rgba(255, 255, 255, 0.3)', 
                            bgcolor: 'rgba(255, 255, 255, 0.7)', 
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                            gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' },
                            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" fontWeight={900}>Payment Methods</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Distribution by channel</Typography>
                        </Box>
                        <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {payments.length > 0 ? (
                                <Chart options={paymentChartOptions} series={paymentChartSeries} type="donut" width="100%" />
                            ) : (
                                <NoDataLottie message="No payment data available" size="180px" />
                            )}
                        </Box>
                    </Paper>
                </Box>

                {/* Recent Transactions Table - SIMPLE TABLE DESIGN */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight={700}>Recent Transactions</Typography>
                </Box>
                <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'white' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
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
                                {recentData.length > 0 ? (
                                    recentData.map((trx) => {
                                        const customerName = trx.customer?.name || 'Walk-in Customer';
                                        const custStyle = getCustomerColor(customerName);
                                        
                                        // Extract payment parts from paymentModes array [{name, amount}]
                                        const cashAmount = trx.paymentModes?.find(p => p.name === 'CASH')?.amount;
                                        const cardAmount = trx.paymentModes?.find(p => p.name === 'CARD')?.amount;
                                        const digitalAmount = trx.paymentModes?.find(p => p.name === 'DIGITAL')?.amount;

                                        return (
                                            <TableRow 
                                                key={trx.orderId} 
                                                hover 
                                                onClick={() => handleRowClick(trx)}
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
                                                            {trx.orderId}
                                                        </Typography>
                                                        {trx.isPriceAdjusted && (
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
                                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{dayjs(trx.createdAt).format('MMM DD, hh:mm A')}</TableCell>
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
                                                <TableCell sx={{ fontWeight: 700 }}>{formatAmountWithComma(trx.total)}</TableCell>
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
                                                        label={trx.status} 
                                                        size="small"
                                                        color={trx.status === 'COMPLETED' ? 'success' : (trx.status === 'PENDING' ? 'warning' : 'error')} 
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
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <NoDataLottie message="No transactions found for the selected period" size="150px" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={recentPagination.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid #f1f5f9',
                            '.MuiTablePagination-toolbar': { minHeight: 64 },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontWeight: 700, color: 'text.secondary' }
                        }}
                    />
                </Paper>
            </Box>

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
                                    <Typography variant="h3" fontWeight={900}>{selectedTrx.orderId}</Typography>
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
                                            {selectedTrx.paymentModes?.map(pm => (
                                                <Chip 
                                                    key={pm.name}
                                                    label={`${pm.name}: ${formatAmountWithComma(pm.amount)}`}
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
                                                            label={`Adjusted from ${formatAmountWithComma(item.originalPrice)}`}
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

export default Reports;

import React from 'react';
import { 
    Box, 
    Typography, 
    Stack, 
    Button, 
    Paper, 
    Grid, 
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
    useTheme
} from '@mui/material';
import Chart from 'react-apexcharts';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: theme.palette.text.secondary, fontWeight: 500 } }
        },
        yaxis: {
            labels: { 
                formatter: (val) => `$${val}k`,
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
        data: [1.2, 2.5, 1.8, 3.2, 2.8, 4.5, 3.8] // in k
    }];

    const paymentChartOptions = {
        chart: { type: 'donut' },
        labels: ['Credit Card', 'Cash', 'Digital Wallet'],
        colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
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
                            formatter: () => '$12.4k'
                        }
                    }
                }
            }
        }
    };

    const paymentChartSeries = [60, 30, 10];

    const transactions = [
        { id: '#TRX-8859', date: 'Oct 24, 10:42 AM', items: 'Nike Air Max (x1), Socks (x2)', method: 'Credit Card', icon: <CreditCardIcon />, total: '$145.00', status: 'Completed' },
        { id: '#TRX-8858', date: 'Oct 24, 10:15 AM', items: 'Basic T-Shirt (x3)', method: 'Cash', icon: <PaymentsIcon />, total: '$45.00', status: 'Completed' },
        { id: '#TRX-8857', date: 'Oct 24, 09:45 AM', items: 'Denim Jacket (x1)', method: 'Digital Wallet', icon: <AccountBalanceWalletIcon />, total: '$85.00', status: 'Completed' },
        { id: '#TRX-8856', date: 'Oct 23, 08:30 PM', items: 'Running Shoes (x1)', method: 'Credit Card', icon: <CreditCardIcon />, total: '$120.00', status: 'Refunded' },
        { id: '#TRX-8855', date: 'Oct 23, 07:15 PM', items: 'Coffee Mug (x2), Napkins', method: 'Cash', icon: <PaymentsIcon />, total: '$25.00', status: 'Completed' }
    ];

    return (
        <Box sx={{ 
            p: 4, 
            height: '100vh', 
            overflowY: 'auto', 
            bgcolor: '#f8fafc',
            backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
            m: -3 
        }}>
            {/* Top Bar - Refined */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ mt: 1 }}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel id="date-range-label" sx={{ fontWeight: 700 }}>Date Range</InputLabel>
                                <Select 
                                    labelId="date-range-label"
                                    label="Date Range"
                                    defaultValue="this-week"
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
                                    <MenuItem value="custom">Custom Range</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Box>
                <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<PictureAsPdfIcon />}
                        sx={{ 
                            borderRadius: 3, 
                            textTransform: 'none', 
                            fontWeight: 800, 
                            px: 4, 
                            height: 48,
                            bgcolor: 'white', 
                            border: '1px solid #e2e8f0', 
                            color: 'text.primary',
                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                        }}
                    >
                        Export PDF
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<DescriptionIcon />}
                        sx={{ 
                            borderRadius: 3, 
                            textTransform: 'none', 
                            fontWeight: 800, 
                            px: 4, 
                            height: 48,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                            '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
                        }}
                    >
                        Export CSV
                    </Button>
                </Stack>
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
                <KPICard title="Total Revenue" value="$12,450.00" subtitle="Compared to last week" trend="up" trendValue="12%" color="success" />
                <KPICard title="Transactions" value="342" subtitle="Total orders processed" trend="up" trendValue="5%" color="success" />
                <KPICard title="Avg. Ticket" value="$36.40" subtitle="Average order value" trend="down" trendValue="2%" color="error" />
                <KPICard title="Net Profit" value="$4,200.00" subtitle="After expenses" trend="up" trendValue="8%" color="success" />
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>Revenue Trends</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Daily revenue performance</Typography>
                        </Box>
                        <Button variant="text" sx={{ textTransform: 'none', fontWeight: 800, color: 'primary.main', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>View Detailed Report</Button>
                    </Box>
                    <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height={320} />
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
                        <Chart options={paymentChartOptions} series={paymentChartSeries} type="donut" width="100%" />
                    </Box>
                </Paper>
            </Box>

            {/* Recent Transactions Table - Premium Refinement */}
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 7, 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(30px)',
                    overflow: 'hidden',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.04)'
                }}
            >
                <Box sx={{ p: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Recent Transactions</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Last 5 orders processed</Typography>
                    </Box>
                    <TextField 
                        placeholder="Search ID..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, bgcolor: 'white', '& fieldset': { borderColor: '#f1f5f9' } }
                        }}
                        sx={{ width: 280 }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha('#f8fafc', 0.5) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, pl: 4 }}>Transaction ID</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Date & Time</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Items</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Method</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>Total</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, pr: 4 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((trx) => (
                                <TableRow 
                                    key={trx.id} 
                                    hover 
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        transition: '0.2s',
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), cursor: 'pointer' }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 800, pl: 4, color: 'text.primary' }}>{trx.id}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>{trx.date}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.primary', maxWidth: 250 }}>{trx.items}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {React.cloneElement(trx.icon, { sx: { fontSize: 16, color: 'primary.main' } })}
                                            </Box>
                                            <Typography variant="body2" fontWeight={700} color="text.primary">{trx.method}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '1rem', color: theme.palette.primary.main }}>{trx.total}</TableCell>
                                    <TableCell sx={{ pr: 4 }}>
                                        <Chip 
                                            label={trx.status} 
                                            size="small"
                                            sx={{ 
                                                fontWeight: 900,
                                                borderRadius: 2,
                                                fontSize: '0.65rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                bgcolor: trx.status === 'Completed' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                color: trx.status === 'Completed' ? 'success.main' : 'error.main'
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

export default Reports;

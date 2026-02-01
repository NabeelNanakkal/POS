import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Paper, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dashboardService from 'services/dashboardService';

const RevenueChart = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
        { name: 'Revenue', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Sales', data: [0, 0, 0, 0, 0, 0, 0] }
    ]
  });

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getActivityCounts({
        store: user?.store?._id || user?.store
      });
      if (response.data) {
        setData({
          labels: response.data.labels,
          series: response.data.datasets
        });
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      width: '100%',
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [50, 100, 100, 100]
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      padding: {
          top: 0,
          right: 15,
          bottom: 0,
          left: 10
      }
    },
    xaxis: {
      categories: data.labels,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '11px'
        },
        formatter: (value) => {
          if (value === 0) return "$0";
          // If the values are very small (like $1, $2), we show decimals to be accurate 
          // but usually for revenue we want to avoid showing tiny increments if total is 0
          if (value >= 1000) return "$" + (value / 1000).toFixed(0) + "k";
          return "$" + value;
        }
      },
      tickAmount: 4,
      // Ensure the scale doesn't look 'broken' when there is no data
      // by forcing a professional minimum range ($100, $200, $300, $400)
      min: 0,
      max: (max) => (max < 400 ? 400 : max), 
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      itemMargin: {
        horizontal: 10,
        vertical: 10
      },
      markers: {
        width: 10,
        height: 10,
        radius: 12,
        offsetY: 0
      },
      fontFamily: theme.typography.fontFamily,
      fontWeight: 600,
      labels: {
        colors: theme.palette.text.primary
      }
    },
    tooltip: {
        theme: theme.palette.mode,
        x: {
            show: true
        }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', width: '100%', position: 'relative' }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        justifyContent="space-between" 
        spacing={2}
        mb={3}
      >
        <Box>
            <Typography variant="h4" fontWeight={700}>Revenue Analytics</Typography>
            <Typography variant="caption" color="text.secondary">Sales performance over time</Typography>
        </Box>
        <Stack direction="row" spacing={1} bgcolor="grey.100" p={0.5} borderRadius={2} alignSelf={{ xs: 'stretch', sm: 'auto' }}>
            {['week', 'month', 'year'].map(range => (
                <Button 
                    key={range}
                    size="small"
                    fullWidth
                    disabled={range !== 'week'} // Only week is implemented for now
                    onClick={() => setTimeRange(range)}
                    sx={{ 
                        minWidth: { xs: 'auto', sm: 50 },
                        borderRadius: 1.5,
                        textTransform: 'capitalize',
                        bgcolor: timeRange === range ? 'white' : 'transparent',
                        color: timeRange === range ? 'text.primary' : 'text.secondary',
                        boxShadow: timeRange === range ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        '&:hover': { bgcolor: timeRange === range ? 'white' : 'transparent' }
                    }}
                >
                    {range}
                </Button>
            ))}
        </Stack>
      </Stack>
      
      <Box sx={{ 
        minHeight: { xs: 300, sm: 350 }, 
        width: '100%', 
        ...(isLoading && { display: 'flex', alignItems: 'center', justifyContent: 'center' }) 
      }}>
        {isLoading ? (
            <CircularProgress size={40} thickness={4} />
        ) : (
            <ReactApexChart 
                options={chartOptions} 
                series={data.series} 
                type="area" 
                height={theme.breakpoints.down('sm') ? 300 : 380} 
                width="100%"
            />
        )}
      </Box>
    </Paper>
  );
};

export default RevenueChart;

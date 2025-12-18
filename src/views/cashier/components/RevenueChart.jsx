import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const RevenueChart = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');

  const chartData = {
    series: [{
      name: 'Revenue',
      data: [3100, 4000, 2800, 5100, 4200, 6900, 7500]
    }, {
      name: 'Sales',
      data: [1100, 3200, 4500, 3200, 3400, 5200, 4100]
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
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
            right: 0,
            bottom: 0,
            left: 10
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return "$" + value / 1000 + "k";
          }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right', 
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
            <Typography variant="h4" fontWeight={700}>Revenue Analytics</Typography>
            <Typography variant="caption" color="text.secondary">Sales performance over time</Typography>
        </Box>
        <Stack direction="row" spacing={1} bgcolor="grey.100" p={0.5} borderRadius={2}>
            {['week', 'month', 'year'].map(range => (
                <Button 
                    key={range}
                    size="small"
                    onClick={() => setTimeRange(range)}
                    sx={{ 
                        minWidth: 50,
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
      
      <Box sx={{ minHeight: 350, width: '100%' }}>
        <ReactApexChart 
            options={chartData.options} 
            series={chartData.series} 
            type="area" 
            height={450} 
        />
      </Box>
    </Paper>
  );
};

export default RevenueChart;

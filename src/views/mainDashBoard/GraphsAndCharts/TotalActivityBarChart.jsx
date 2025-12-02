import PropTypes from 'prop-types';
import React from 'react';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getActivityCounts } from 'container/dashBoardContainer/slice';

const TotalActivityBarChart = ({activityCounts}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const theme = useTheme();
  const navigate = useNavigate();
  const isLoading = false

  const hourlyActivityData = activityCounts?.hourlyBreakup;

  const filtered12HrData = hourlyActivityData?.filter((entry) => {
    const hour = parseInt(entry.hour.split(':')[0]);
    return hour >= 7 && hour <= 20;
  });

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const chartDataDay = {
    height: 380,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 960,
          options: {
            chart: {
              height: 300
            },
            plotOptions: {
              bar: {
                columnWidth: '70%'
              }
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: '10px'
                }
              }
            },
            legend: {
              position: 'bottom',
              fontSize: '12px',
              offsetX: 0,
              offsetY: 5,
              itemMargin: {
                horizontal: 5,
                vertical: 5
              }
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 250
            },
            plotOptions: {
              bar: {
                columnWidth: '80%'
              }
            },
            xaxis: {
              labels: {
                rotate: -90,
                style: {
                  fontSize: '8px'
                }
              }
            },
            legend: {
              fontSize: '10px',
              markers: {
                width: 12,
                height: 12
              }
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories: ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        }
      },
      fill: {
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      }
    },
    series: [
      {
        name: 'L T Execution',
        data: filtered12HrData?.map((data) => data.legalToolExecution) || []
      },
      {
        name: 'HD Visit',
        data: filtered12HrData?.map((data) => data.hdv) || []
      },
      {
        name: 'PTP',
        data: filtered12HrData?.map((data) => data.ptp) || []
      },
      {
        name: 'Verification',
        data: filtered12HrData?.map((data) => data.verification) || []
      },
      {
        name: 'Follow Up',
        data: filtered12HrData?.map((data) => data.followup) || []
      }
    ]
  };

  React.useEffect(() => {
    const newChartData = {
      ...chartDataDay.options,
      colors: ['#012a4a', '#01497c', '#2a6f97', '#61a5c2', '#a9d6e5'],
      xaxis: {
        labels: {
          style: {
            colors: Array(13).fill(primary)
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [isLoading, primary, divider, grey500]);

  // React.useEffect(() => {
  //   dispatch(getActivityCounts(dayjs().format('YYYY-MM-DD')));
  // }, [dispatch]);

  const activitySummary = [
    { label: 'Total Count', value: activityCounts?.totalCount || 0, highlight: true },
    { label: 'Count A', value: activityCounts?.legalToolExecutionCount || 0 },
    { label: 'Count B', value: activityCounts?.hdvCount || 0 },
    { label: 'Count C', value: activityCounts?.ptpCount || 0 },
    { label: 'Count D', value: activityCounts?.verificationCount || 0 },
    { label: 'Count E', value: activityCounts?.followupCount || 0 },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between" direction={{ xs: 'column', md: 'row' }}>
                {/* Left side: Activity Counts */}
                <Grid item xs={12} md={9} px={1}>
                  <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2}>

                    {activitySummary.map((activity, index) => (
                      <Grid key={index} item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.55rem', sm: '0.720rem' } }}>
                              {activity.label}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h3" sx={{ fontSize: { xs: '1rem', sm: '1.20rem' } }}>
                              {activity.value || 0}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} md={2.5} container justifyContent={{ xs: 'center', md: 'flex-end' }} sx={{ mt: { xs: 2, md: 0 } }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      disabled={isLoading}
                      sx={{ width: { xs: '100%', sm: '170px' } }}
                      value={selectedDate}
                      maxDate={dayjs()}
                      onChange={(newValue) => {
                        if (newValue) {
                          setSelectedDate(newValue);
                          dispatch(getActivityCounts(newValue.format('YYYY-MM-DD')));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          sx: {
                            bgcolor: 'white',
                            '& .MuiInputBase-root': {
                              height: '40px'
                            },
                            '& .css-1f51qn3.MuiInputBase-inputSizeSmall, & .MuiInputBase-inputSizeSmall': {
                              padding: '6px 10px'
                            },
                            '& .MuiInputAdornment-root': {
                              margin: '0px',
                              '& .MuiButtonBase-root': {
                                padding: '2px'
                              }
                            }
                          }
                        }
                      }}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </Grid>

              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Chart {...chartDataDay} />
            </Grid>
          </Grid>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button
              size="small"
              onClick={() => navigate('/activities/fieldActivity')}
              disableElevation
              sx={{ fontSize: { xs: '0.55rem', sm: '0.750rem' } }}
            >
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

TotalActivityBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalActivityBarChart;
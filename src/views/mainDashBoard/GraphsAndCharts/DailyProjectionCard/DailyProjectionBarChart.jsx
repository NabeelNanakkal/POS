
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';


// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const DailyProjectionBarChart = ({ isLoading }) => {

  const theme = useTheme();
  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const ScheduleData = useSelector((state) => state.commonMenu?.todaySchedule);

  const {
    totalProjectedVisits,
    totalCompletedVisits,
    totalProjectedAmount,
    totalCompletedAmount,
    visitsPercentage,
    collectionsPercentage,
  } = useMemo(() => {
    const totalProjectedVisits = ScheduleData?.length || 0;
    const totalCompletedVisits = ScheduleData?.filter(
      (visit) => visit.visitStatus === 'Closed'
    ).length || 0;
    const totalProjectedAmount = ScheduleData?.reduce(
      (sum, visit) => sum + (visit.expectedAmount || 0),
      0
    ) || 0;
    const totalCompletedAmount = ScheduleData?.reduce(
      (sum, visit) =>
         sum + (visit.collectionAmount || 0),
      0
    ) || 0;

    const visitsPercentage = totalProjectedVisits
      ? Math.round((totalCompletedVisits / totalProjectedVisits) * 100)
      : 0;
    const collectionsPercentage = totalProjectedAmount
      ? Math.round((totalCompletedAmount / totalProjectedAmount) * 100)
      : 0;

    return {
      totalProjectedVisits,
      totalCompletedVisits,
      totalProjectedAmount,
      totalCompletedAmount,
      visitsPercentage,
      collectionsPercentage,
    };
  }, [ScheduleData]);

  const chartData = {
    // height: 250,
    type: 'bar',
    options: {
      chart: {
        id: 'visits-collections-chart',
        toolbar: { show: false },
        zoom: { enabled: false },
        width: '100%', // Ensure chart takes full width
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '75%',
          grouped: true,
        },
      },
      xaxis: {
        categories: ['Visits', 'Collections'],
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: `'Roboto', sans-serif`,
            colors: [primary],
          },
        },
      },
      yaxis: {
        title: {
          text: 'Progress (%)',
          style: {
            fontSize: '11px',
            fontFamily: `'Roboto', sans-serif`,
            color: primary,
          },
        },
        labels: {
          style: {
            colors: [primary],
            fontSize: '10px',
            fontFamily: `'Roboto', sans-serif`,
          },
          formatter: (val) => `${val}%`,
        },
        max: 100,
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '11px',
        fontFamily: `'Roboto', sans-serif`,
        labels: { colors: grey500 },
        markers: { width: 12, height: 12, radius: 4 },
        itemMargin: { horizontal: 10, vertical: 2 },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          const isProjected = seriesIndex === 0;
          const category = dataPointIndex === 0 ? 'Visits' : 'Collections';
          if (isProjected) {
            return category === 'Visits' ? `${totalProjectedVisits} (100%)` : `₹${totalProjectedAmount.toLocaleString()} (100%)`;
          } else {
            return category === 'Visits'
              ? `${totalCompletedVisits} (${val}%)`
              : `₹${totalCompletedAmount.toLocaleString()} (${val}%)`;
          }
        },
        style: { fontSize: '10px' },
      },
      grid: {
        show: true,
        borderColor: divider,
        strokeDashArray: 3,
      },
      tooltip: {
        theme: 'light',
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const isProjected = seriesIndex === 0;
          const category = w.globals.labels[dataPointIndex];

          if (category === 'Visits') {
            const actual = isProjected ? totalProjectedVisits : totalCompletedVisits;
            return `<div style="padding: 8px; font-size: 12px;"><b>${isProjected ? 'Projected' : 'Completed'}</b><br/>${actual} visits</ AscendingDescendings</div>`;
          } else {
            const actual = isProjected ? totalProjectedAmount : totalCompletedAmount;
            return `<div style="padding: 8px; font-size: 12px;"><b>${isProjected ? 'Projected' : 'Completed'}</b><br/>₹${actual.toLocaleString()}</div>`;
          }
        },
      },
      colors: ['#2a6f97', '#61a5c2'],
    },
    series: [
      { name: 'Target', data: [100, 100] },
      { name: 'Achieved', data: [visitsPercentage, collectionsPercentage] },
    ],
  };

  React.useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: ['#2a6f97', '#61a5c2'],
      xaxis: {
        ...chartData.options.xaxis,
        labels: {
          style: {
            colors: [primary],
            fontSize: '11px',
            fontFamily: `'Roboto', sans-serif`,
          },
        },
      },
      yaxis: {
        ...chartData.options.yaxis,
        title: {
          ...chartData.options.yaxis.title,
          style: {
            fontSize: '11px',
            fontFamily: `'Roboto', sans-serif`,
            color: primary,
          },
        },
        labels: {
          ...chartData.options.yaxis.labels,
          style: {
            colors: [primary],
            fontSize: '10px',
            fontFamily: `'Roboto', sans-serif`,
          },
        },
      },
      grid: { borderColor: divider },
      legend: { ...chartData.options.legend, labels: { colors: grey500 } },
    };

    if (!isLoading) {
      ApexCharts.exec('visits-collections-chart', 'updateOptions', newChartData);
    }
  }, [isLoading, primary, divider, grey500, visitsPercentage, collectionsPercentage]);


  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <Grid container sx={{ width: '100%', maxWidth: '100%' }} spacing={0}>
          <Grid item xs={12} sx={{ padding: 0, margin: 0 }}>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={200}
              width="100%"
              className="mt-4"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

DailyProjectionBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default DailyProjectionBarChart;

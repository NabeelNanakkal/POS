// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const chartDataDay = {
  height: 480,
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
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
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
      categories: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM']
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
      name: 'Verification',
      data: [4, 9, 7, 10, 12, 9, 13, 8, 6, 11, 11, 9, 5]
    },
    {
      name: 'Legal Tool Execution',
      data: [3, 4, 5, 6, 8, 10, 7, 5, 4, 9, 8, 6, 3]
    },
    {
      name: 'PTP',
      data: [6, 11, 9, 7, 13, 8, 4, 7, 11, 6, 5, 10, 8]
    },
    {
      name: 'Follow Up',
      data: [2, 3, 4, 5, 6, 8, 9, 7, 5, 4, 2, 1, 1]
    }
  ]
};

export default chartDataDay;

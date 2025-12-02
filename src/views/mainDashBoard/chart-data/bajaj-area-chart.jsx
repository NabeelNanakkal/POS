// ==============================|| DASHBOARD - BAJAJ AREA CHART ||============================== //

const chartData = {
  type: 'area',
  height: 70,
  options: {
    chart: {
      id: 'support-chart',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => ''
        }
      },
      marker: {
        show: false
      }
    }
  },
  series: [
    {
      data: [29876, 17893, 29876]
    }
  ]
};

export default chartData;

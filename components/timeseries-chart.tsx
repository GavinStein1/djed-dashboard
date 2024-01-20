import React from "react";
// import ReactApexChart from "react-apexcharts";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Series {
  name: string;
  data: number[];
  color: string;
}

interface XChartProps {
  xSeries: string[];
  series: Array<Series>;
}

interface StackedChartProps {
  xSeries: string[];
  ySeriesA: number[];
  ySeriesB: number[];
  title: string;
  titleA: string;
  titleB: string;
}

// Component enables 1 or 2 Y series with multiple Y axes.
export const XTimeSeriesChart: React.FC<XChartProps> = ({ xSeries, series}) => {  
  if (series.length > 2) {
    series = [series[0]];
  }
  var colors: string[] = []; 
  for (var i = 0; i < series.length; i ++) {
    colors.push(series[i].color);
  } 
  var yaxis;
  if (series.length > 1) {
    yaxis = [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: colors[0]
        },
        labels: {
          style: {
            colors: colors[0]
          },
          formatter: function (val: number) {
            if (val < 1000) {
              return val.toFixed(3);
            } else if (val < 100000) {
              return val.toFixed(2);
            } else {
              return val.toFixed(0);
            }
          }
        },
        seriesName: series[0].name,
        title: {
          text: series[0].name,
          style: {
            color: colors[0]
          }
        }
      },
      {
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: colors[1]
        },
        labels: {
          style: {
            colors: colors[1]
          },
          formatter: function (val: number) {
            if (val < 1000) {
              return val.toFixed(3);
            } else if (val < 100000) {
              return val.toFixed(2);
            } else {
              return val.toFixed(0);
            }
          }
        },
        title: {
          text: series[1].name,
          style: {
            color: colors[1]
          }
        }
      }
    ];
  } else {
    yaxis = {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        color: colors[0]
      },
      labels: {
        style: {
          colors: colors[0]
        },
        formatter: function (val: number) {
          if (val < 1000) {
            return val.toFixed(3);
          } else if (val < 100000) {
            return val.toFixed(2);
          } else {
            return val.toFixed(0);
          }
        }
      },
      title: {
        text: series[0].name,
        style: {
          color: colors[0]
        }
      }
    }
  }
  const state = {
    
      series: series,
      options: {
        chart: {
          colors: colors,
          type: 'area' as const,
          stacked: false,
          height: 500,
          zoom: {
            type: 'x' as const,
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom' as const
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 0.5,
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: yaxis,
        xaxis: {
          type: 'datetime' as const,
          categories: xSeries,
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val: number) {
              if (val < 1000) {
                  return val.toFixed(3);
              } else if (val < 100000) {
                  return val.toFixed(2);
              } else {
                  return val.toFixed(0);
              }
            }
          }
        },
        stroke: {
          curve: 'straight' as const
        }
      },
    
    
    };
  return (
      <div id="chart">
          <Chart options={state.options} series={state.series} type="area" height={500} />
      </div>
  )
}

export const StackedTimeSeriesChart: React.FC<StackedChartProps> = ({ xSeries, ySeriesA, ySeriesB, title, titleA, titleB}) => {    
  const state = {
    
      series: [{
        data: ySeriesA,
        name: titleA,
        color: '#424a7b'
      },{
        data: ySeriesB,
        name: titleB,
        color: '#7054d1'
      }],
      options: {
        chart: {
          type: 'line' as const,
          stacked: true,
          height: 500,
          zoom: {
            type: 'x' as const,
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom' as const
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        fill: { 
          gradient: {
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              if (val < 1000) {
                  return val.toFixed(3);
              } else if (val < 100000) {
                  return val.toFixed(2);
              } else {
                  return val.toFixed(0);
              }
            },
          },
          title: {
            text: title
          },
        },
        xaxis: {
          type: 'datetime' as const,
          categories: xSeries,
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val: number) {
              if (val < 1000) {
                  return val.toFixed(3);
              } else if (val < 100000) {
                  return val.toFixed(2);
              } else {
                  return val.toFixed(0);
              }
            }
          }
        },
        stroke: {
          curve: 'straight' as const
        }
      },
    
    
    };
  return (
      <div id="chart">
          <Chart options={state.options} series={state.series} type="area" height={500} />
      </div>
  )
}
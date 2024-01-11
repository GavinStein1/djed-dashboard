import React from "react";
// import ReactApexChart from "react-apexcharts";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
    xSeries: string[];
    ySeries: number[];
    title: string;
}

const TimeSeriesChart: React.FC<ChartProps> = ({ xSeries, ySeries, title }) => {    
    const state = {
      
        series: [{
          name: title,
          data: ySeries
        }],
        options: {
          chart: {
            type: 'area' as const,
            stacked: false,
            height: 350,
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
            size: 0,
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100]
            },
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
          }
        },
      
      
      };
    return (
        <div id="chart">
            <Chart options={state.options} series={state.series} type="area" height={350} />
        </div>
    )
}

export default TimeSeriesChart;
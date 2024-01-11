"use client"

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import {CircularProgress, Tabs, Tab, Accordion, AccordionItem} from "@nextui-org/react";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import NavbarComponent from '@/components/navbar'
import CardComponent from '@/components/card'
import * as helper from '@/script/helper';
import ReactApexChart from 'react-apexcharts';

const inter = Inter({ subsets: ['latin'] })

interface SeriesData {
  block: number;
  ada_reserve: number;
  djed_reserve: number;
  shen_reserve: number;
  ada_price: number
}

interface ChartData {
  x: number[];
  y: SeriesData[];
}

export default function Home() {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adaPriceSeriesData, setAdaPriceSeriesData] = useState([]);
  const [djedPriceSeriesData, setDjedPriceSeriesData] = useState([]);
  const [shenPriceSeriesData, setShenPriceSeriesData] = useState([]);
  const [reserveSeriesData, setReserveSeriesData] = useState([]);
  const [liabilitiesSeriesData, setLiabilitiesSeriesData] = useState([]);
  const [equitySeriesData, setEquitySeriesData] = useState([]);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const disclaimer = "While the utmost care has been taken to compile the data displayed here, there is no guarantee that the data is up to date or accurate. This site was put together as a pet project. Please do not make financial decisions based on this data alone, and do your own research."

  let formatCurrency = Intl.NumberFormat();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("api/blockfrost");
        const response = await fetch("api/firebase");
        if (!response.ok) {
          throw Error("Request failed with status ${response.status}");
        }
        const firebaseData = await response.json();
        setData(processData(firebaseData));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div>
        <NavbarComponent />
        <div className="flex items-center justify-center h-screen">
          <CircularProgress label="Loading..."/>
        </div>
      </div>
    )
  } else {
    if (!data) {
      return (
        <div>
          <p>no data exists</p>
        </div>
      )
    }
    const latest = data.y[data.y.length - 1];
    const circulatingDjed = helper.calculateCirculating(latest.djed_reserve);
    const circulatingShen = helper.calculateCirculating(latest.shen_reserve);
    const adaPrice = latest.ada_price;
    const reserve = latest.ada_reserve / 10**6;
    const djedPrice = helper.scPrice(latest.djed_reserve, latest.ada_reserve, adaPrice);
    const liabilities = helper.calculateLiabilities(circulatingDjed, djedPrice);
    const equity = helper.calculateEquity(liabilities, reserve);
    const shenPrice = helper.rcPrice(latest.shen_reserve, equity);
    const ratio = helper.calculateRatio(reserve, liabilities);
    var adaChart: number[] = [];
    var djedChart: number[] = [];
    var shenChart: number[] = [];
    var reserveChart: number[] = [];
    var liabilitiesChart: number[] = [];
    var equityChart: number[] = [];
    var xDataSeries = [];
    const last30 = computeLast30Days(data, currentTimestamp);
    var i = last30.x.length - 1;
    while (i > 0) {
      var adaTemp = last30.y[i].ada_price;
      var circulatingDjedTemp = helper.calculateCirculating(last30.y[i].djed_reserve);
      var circulatingShenTemp = helper.calculateCirculating(last30.y[i].shen_reserve);
      var reserveTemp = last30.y[i].ada_reserve / 10**6;
      var djedPriceTemp = helper.scPrice(last30.y[i].djed_reserve, last30.y[i].ada_reserve, adaTemp);
      var liabilitiesTemp = helper.calculateLiabilities(circulatingDjedTemp, djedPriceTemp);
      var equityTemp = helper.calculateEquity(liabilitiesTemp, reserveTemp);
      var shenPriceTemp = helper.rcPrice(last30.y[i].shen_reserve, equityTemp);
      adaChart.push(adaTemp);
      djedChart.push(djedPriceTemp);
      shenChart.push(shenPriceTemp);
      reserveChart.push(reserveTemp);
      liabilitiesChart.push(liabilitiesTemp);
      equityChart.push(equityTemp);
      xDataSeries.push(last30.x[i]);
      i = i - 1;
    }
    
    return (
      <div>
        <NavbarComponent />
        <div className="margin20">
          
          <div className="container">
            <div className="first-div">
              <div className="regular-text width-75">
                <p className="white margin20">{disclaimer}</p>
              </div>
              <div className="grid grid-cols-2 align-center">
                <div className="color-background rounded-corners">
                  <p className="small-heading margin10 align-left">Reserve Health</p>
                  <p className="small-display-text margin10 bold">{String((ratio*100).toFixed(0)) + "%"}</p>
                  <p className="small-heading margin10 align-left">Reserves</p>
                  <p className="small-display-text margin10">{"₳" + formatCurrency.format(reserve)}</p>
                  <p className="small-heading margin10 align-left">Liabilities</p>
                  <p className="small-display-text margin10">{"₳" + formatCurrency.format(liabilities)}</p>
                  <p className="small-heading margin10 align-left">Equity</p>
                  <p className="small-display-text margin10">{"₳" + formatCurrency.format(equity)}</p>
                </div>
                {createPieChart(liabilities, equity)}
              </div>
            </div>
            <div className="second-div">
              <div className="small-card">
                <p className="small-heading margin10 align-left">ADA</p>
                <p className="small-display-text margin10 bold">{"$" + formatCurrency.format(adaPrice)}</p>
              </div>
              <div className="small-card">
                <p className="small-heading margin10 align-left">Djed Stablecoin</p>
                <p className="small-display-text margin10 bold">{"₳" + formatCurrency.format(djedPrice)}</p>
                <p className="small-heading margin10 align-left">Circulating</p>
                <p className="small-display-text margin10 bold">{formatCurrency.format(circulatingDjed)}</p>
              </div>
              <div className="small-card">
                <p className="small-heading margin10 align-left">Shen Reservecoin</p>
                <p className="small-display-text margin10 bold">{"₳" + formatCurrency.format(shenPrice)}</p>
                <p className="small-heading margin10 align-left">Circulating</p>
                <p className="small-display-text margin10 bold">{formatCurrency.format(circulatingShen)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function processData(json_data: Record<number, SeriesData>): ChartData {
  var data_list_x: number[] = [];
  var data_list_y: SeriesData[] = [];

  for (const key in json_data) {
    if (Object.prototype.hasOwnProperty.call(json_data, key)) {
      data_list_x.push(Number(key));
      data_list_y.push(json_data[key]);
    }
  }
  return {x: data_list_x, y: data_list_y};
}

function createPieChart(liabilities: number | undefined, equity: number | undefined) {
  if (!liabilities || !equity) {
    return (
      <p>No data for chart</p>
    )
  }
  var state = { 
    series: [liabilities, equity],
    options: {
      labels: ['Liabilities', 'Equity'],
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return Intl.NumberFormat().format(val);
          }
        }
      }
    },
  };
  return (
    <div className='flex justify-center'>
      {(typeof window !== 'undefined') &&
        <Chart
          options={state.options}
          series={state.series}
          type="pie"
          height="100%"
        />
      }
    </div>
  );
}

function createLineChart(data: number[], xData: number[], title: string) {
  const state = {
    series: [{
      name: title,
      data: {
        x: xData,
        y: data
      }
    }],
    options: {
      chart: {
        type: "area" as const,
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
      title: {
        text: title,
        align: 'left' as const
      }, 
      fill: {
        type: 'gradient' as const,
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
            return (val / 1000000).toFixed(0);
          },
        },
      },
      xaxis: {
        type: 'datetime' as const,
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: number) {
            return (val / 1000000).toFixed(0)
          }
        }
      }
    }
  }

  return (
    <div id="chart">
      {/* <Chart options={state.options} series={state.series} type="area" height={350} /> */}
      <p>CHART</p>
    </div>
  )
}

function computeLast30Days(data: ChartData, currentTimestamp: number): ChartData {
  const last30 = currentTimestamp - (30 * 24 * 60 * 60);
  var i = data.x.length - 1;
  var x = [];
  var y = [];
  while (i > 0) {
    if (data.x[i] > last30) {
      x.push(data.x[i]);
      y.push(data.y[i]);
      i = i - 1;
    } else {
      break;
    }
  }

  return {
    x,
    y
  };
}
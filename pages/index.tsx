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
          <Tabs aria-label="Options">
            <Tab key="price-data" title="Price Data">
              <div className="margin20 grid grid-cols-1">
                <Accordion>
                  <AccordionItem key="1" aria-label="ADA Price" title="ADA Price">
                    <CardComponent 
                      dataGroup='Price Data'
                      dataName='ADA Price' 
                      dataValue={"$" + formatCurrency.format(adaPrice)}
                      hasChart={true}
                      chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                      chartYData={adaChart}
                    />
                  </AccordionItem>
                  <AccordionItem key="2" aria-label="Djed Price" title="Djed Price">
                    <CardComponent
                      dataGroup='Price Data'
                      dataName='Djed Price'
                      dataValue={"₳" + formatCurrency.format(djedPrice)}
                      hasChart={true}
                      chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                      chartYData={djedChart}
                    />
                  </AccordionItem>
                  <AccordionItem key="3" aria-label="Shen Price" title="Shen Price">
                    <CardComponent
                      dataGroup='Price Data'
                      dataName='Shen Price'
                      dataValue={"₳" + formatCurrency.format(shenPrice)}
                      hasChart={true}
                      chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                      chartYData={shenChart}
                    />
                  </AccordionItem>
                </Accordion>
              </div>
            </Tab>
            <Tab key="reserve-data" title="Reserve Data">
              <Accordion>
                <AccordionItem key="1" aria-label="Reserves" title="Reserves">
                  <CardComponent
                    dataGroup='Reserve Data'
                    dataName='Reserves'
                    dataValue={"₳" + formatCurrency.format(reserve)}
                    hasChart={true}
                    chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                    chartYData={reserveChart}
                  />
                </AccordionItem>
                <AccordionItem key="2" aria-label="Liabilities" title="Liabilities">
                  <CardComponent
                    dataGroup='Reserve Data'
                    dataName='Liabilities'
                    dataValue={"₳" + formatCurrency.format(liabilities)}
                    hasChart={true}
                    chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                    chartYData={liabilitiesChart}
                  />
                </AccordionItem>
                <AccordionItem key="3" aria-label="Equity" title="Equity">
                  <CardComponent
                    dataGroup='Reserve Data'
                    dataName='Equity'
                    dataValue={"₳" + formatCurrency.format(equity)}
                    hasChart={true}
                    chartXData={helper.convertUnixTimestampsToDateStrings(xDataSeries)}
                    chartYData={equityChart}
                  />
                  </AccordionItem>
              </Accordion>
            </Tab>
          </Tabs>
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
  if (!liabilities || ! equity) {
    return (
      <p>No data for chart</p>
    )
  }
  var state = { 
    series: [liabilities, equity],
    options: {
      labels: ['Liabilities', 'Equity']
    },
  };
  return (
    <div className='flex justify-center'>
      <h2>Reserve Constitution</h2>
      {(typeof window !== 'undefined') &&
        <Chart
          options={state.options}
          series={state.series}
          type="pie"
          width="500"
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
"use client"

import { useEffect, useState } from 'react'
import { CircularProgress } from "@nextui-org/react";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import NavbarComponent from '@/components/navbar'
import CardComponent from '@/components/card'
import * as helper from '@/script/helper';

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
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const [liveAdaPrice, setLiveAdaPrice] = useState<number>();

  const disclaimer = "While the utmost care has been taken to compile the data displayed here, there is no guarantee that the data is up to date or accurate. This site was put together as a pet project. Please do not make financial decisions based on this data alone, and do your own research. For information on how the data was compiled, please use the tooltips (coming soon...)."

  let formatCurrency = Intl.NumberFormat();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Firebase Realtime Database data
        const firebaseJson = await fetchFirebaseData();
        setData(processData(firebaseJson));

        // Get live ADA price
        const url = "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd";
        const ada_response = await fetch(url);
        if (ada_response.status != 200) {
            setLiveAdaPrice(0.0);
        } else {
            const json = await ada_response.json();
            setLiveAdaPrice(json["cardano"]["usd"]);
        }
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
    if (!data || !liveAdaPrice) {
      return (
        <div>
          <p>Error compiling data</p>
        </div>
      )
    }
    const latest = data.y[data.y.length - 1];
    const circulatingDjed = helper.calculateCirculating(latest.djed_reserve);
    const circulatingShen = helper.calculateCirculating(latest.shen_reserve);
    const adaPrice = liveAdaPrice;
    const reserve = latest.ada_reserve / 10**6;
    const djedPrice = helper.scPrice(latest.djed_reserve, latest.ada_reserve, adaPrice);
    const liabilities = helper.calculateLiabilities(circulatingDjed, djedPrice);
    const equity = helper.calculateEquity(liabilities, reserve);
    const shenPrice = helper.rcPrice(latest.shen_reserve, equity);
    const ratio = helper.calculateRatio(reserve, liabilities);
    const last30 = computeLast30Days(data, currentTimestamp);
    
    return (
      <div>
        <NavbarComponent />
        <div className="margin20">
          <div className="regular-text container padding-20">
            <p className="">{disclaimer}</p>
          </div>
          <div className="container">
            <div className="second-div">
              <CardComponent header1='' header2='ADA' bodyValue={"$" + formatCurrency.format(adaPrice)}>
              </CardComponent>
              <CardComponent header1='' header2='Djed' bodyValue={"₳" + formatCurrency.format(djedPrice)}>
                <p>Circulating</p>
                <p className="child-padding">{formatCurrency.format(circulatingDjed)}</p>
              </CardComponent>
              <CardComponent header1='' header2='Shen' bodyValue={"₳" + formatCurrency.format(shenPrice)}>
                <p>Circulating</p>
                <p className="child-padding">{formatCurrency.format(circulatingShen)}</p>
              </CardComponent>
            </div>
            <div className="first-div">
              <div className="grid grid-cols-2">
                {createPieChart(liabilities, equity)}
                <CardComponent header2="Reserve Health" header1="" bodyValue={String((ratio*100).toFixed(0)) + "%"}>
                  <p className="bold">Reserves</p>
                  <p className="child-padding">{"₳" + formatCurrency.format(reserve)}</p>
                  <p className="bold">Liabilities</p>
                  <p className="child-padding">{"₳" + formatCurrency.format(liabilities)}</p>
                  <p className="bold">Equity</p>
                  <p className="child-padding">{"₳" + formatCurrency.format(equity)}</p>
                </CardComponent>
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
    <div className='flex justify-center padding-pie-chart'>
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

async function fetchFirebaseData() {
  const response = await fetch("https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app/raw_data.json");
  if (response.status != 200) {
    return null;
  } else {
    const jsonData = await response.json();
    return jsonData;
  }
}
import NavbarComponent from "@/components/navbar";
import { Tabs, Tab, Accordion, AccordionItem, CircularProgress } from "@nextui-org/react"
import { TimeSeriesChart, StackedTimeSeriesChart } from "@/components/timeseries-chart";
import { useEffect, useState } from "react";
import * as helper from '@/script/helper';

interface SeriesData {
    block: number;
    ada_reserve: number;
    djed_reserve: number;
    shen_reserve: number;
    ada_price: number
}
  
interface DataFormat {
    x: number[];
    y: SeriesData[];
}

interface ChartData {
    x: number[];
    ada_reserve: number[];
    djed_circulating: number[];
    shen_circulating: number[];
    ada_price: number[];
    djed_price: number[];
    shen_price: number[];
    liabilities: number[];
    equity: number[];
    ratio: number[];
}

export default function Historical() {
    const disclaimer = "While the utmost care has been taken to compile the data displayed here, there is no guarantee that the data is up to date or accurate. This site was put together as a pet project. Please do not make financial decisions based on this data alone, and do your own research. For information on how the data was compiled, please use the tooltips. Calculations have been based on the minimal Djed implementation in the Djed whitepaper."
    const [data, setData] = useState<DataFormat | null>();
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData | null>();

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Get Firebase Realtime Database data
            const firebaseJson = await fetchFirebaseData();
            const processedData = processData(firebaseJson);
            setData(processedData);
            setChartData(splitDataSeries(processedData));
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
    }

    return (
        <div>
            <NavbarComponent />
            <div className="margin20">
                <div className="regular-text container padding-20">
                    <p className="">{disclaimer}</p>
                </div>
                <div className="margin-auto">
                    <Tabs variant="underlined" aria-label="Options">
                        <Tab key="ADA-price" title="ADA Price">
                            {!!chartData ? (
                                <TimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} ySeries={chartData.ada_price} title="ADA Price" />
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Djed-price" title="Djed Price">
                            {!!chartData ? (
                                <TimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} ySeries={chartData.djed_price} title="Djed Price" />
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Shen-price" title="Shen Price">
                            {!!chartData ? (
                                <TimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} ySeries={chartData.shen_price} title="Shen Price" />
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Reserves" title="Reserves">
                            {!!chartData ? (
                                <StackedTimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} ySeriesA={chartData.liabilities} ySeriesB={chartData.equity} title="Reserves" titleA="Liabilities" titleB="Equity"/>
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Ratio" title="Ratio">
                        {!!chartData ? (
                                <TimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} ySeries={chartData.ratio} title="Ratio" />
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab> 
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function processData(json_data: Record<number, SeriesData>): DataFormat {
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

function splitDataSeries(data: DataFormat): ChartData {

    var i = 0;
    var chartData: ChartData = {
        x: [],
        ada_reserve: [],
        djed_circulating: [],
        shen_circulating: [],
        ada_price: [],
        djed_price: [],
        shen_price: [],
        liabilities: [],
        equity: [],
        ratio: []
    };

    var circulatingDjed;
    var circulatingShen;
    var adaPrice;
    var reserve;
    var djedPrice;
    var liabilities;
    var equity;
    var shenPrice;
    var ratio;

    while (i < data.x.length) {
        circulatingDjed = helper.calculateCirculating(data.y[i].djed_reserve);
        circulatingShen = helper.calculateCirculating(data.y[i].shen_reserve);
        adaPrice = data.y[i].ada_price;
        reserve = data.y[i].ada_reserve / 10**6;
        djedPrice = helper.scPrice(data.y[i].djed_reserve, data.y[i].ada_reserve, adaPrice);
        liabilities = helper.calculateLiabilities(circulatingDjed, djedPrice);
        equity = helper.calculateEquity(liabilities, reserve);
        shenPrice = helper.rcPrice(data.y[i].shen_reserve, equity);
        ratio = helper.calculateRatio(reserve, liabilities);
        
        chartData.x.push(data.x[i]);
        chartData.ada_price.push(adaPrice);
        chartData.ada_reserve.push(reserve);
        chartData.djed_circulating.push(circulatingDjed);
        chartData.shen_circulating.push(circulatingShen);
        chartData.djed_price.push(djedPrice);
        chartData.shen_price.push(shenPrice);
        chartData.liabilities.push(liabilities);
        chartData.equity.push(equity);
        chartData.ratio.push(ratio);

        i ++;
    }

    return chartData;
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
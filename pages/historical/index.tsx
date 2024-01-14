import NavbarComponent from "@/components/navbar";
import { Tabs, Tab, RadioGroup, Radio, CircularProgress } from "@nextui-org/react"
import { TimeSeriesChart, StackedTimeSeriesChart, XTimeSeriesChart } from "@/components/timeseries-chart";
import { useEffect, useState } from "react";
import * as helper from '@/script/helper';
import Head from "next/head";

interface SeriesData {
    block: number;
    ada_reserve: number;
    djed_reserve: number;
    shen_reserve: number;
    ada_price: number
}

interface Series {
    name: string;
    data: number[];
    color: string;
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
    const [adaSelected, setAdaSelected] = useState("none");
    const [djedSelected, setDjedSelected] = useState("none");
    const [shenSelected, setShenSelected] = useState("none");
    const [ratioSelected, setRatioSelected] = useState("none");
    const [adaChartSeries, setAdaChartSeries] = useState<Series[]>([]);
    const [djedChartSeries, setDjedChartSeries] = useState<Series[]>([]);
    const [shenChartSeries, setShenChartSeries] = useState<Series[]>([]);
    const [ratioChartSeries, setRatioChartSeries] = useState<Series[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Get Firebase Realtime Database data
            const firebaseJson = await fetchFirebaseData();
            const processedData = processData(firebaseJson);
            setData(processedData);
            const tmpChartData = splitDataSeries(processedData);
            setChartData(tmpChartData);
            setAdaChartSeries([{
                name: "ADA Price",
                data: tmpChartData.ada_price,
                color: "#424a7b"
            }]);
            setDjedChartSeries([{
                name: "Djed Price",
                data: tmpChartData.djed_price,
                color: "#424a7b"
            }]);
            setShenChartSeries([{
                name: "Shen Price",
                data: tmpChartData.shen_price,
                color: "#424a7b"
            }]);
            setRatioChartSeries([{
                name: "Ratio",
                data: tmpChartData.ratio,
                color: "#424a7b"
            }]);
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
            <div className="flex items-center justify-center h-screen">
              <CircularProgress label="Loading..."/>
            </div>
          </div>
        )
    } else {
        if (!data || !chartData) {
          return (
            <div>
              <p>no data exists</p>
            </div>
          )
        }
    }

    function onDataOverlayChange(dataSeries: string, newVal: string) {
        if (!chartData) {
            return;
        }
        console.log(newVal);
        switch (dataSeries) {
            case "ADA":
                setAdaSelected(newVal);
                switch (newVal) {
                    case "none":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "ada-price":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "djed-price":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "shen-price":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "reserves":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "Reserves",
                            data: chartData.ada_reserve,
                            color: "#7054d1"
                        }]);
                        break;
                    case "liabilities":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "Liabilities",
                            data: chartData.liabilities,
                            color: "#7054d1"
                        }]);
                        break;
                    case "equity":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "Equity",
                            data: chartData.equity,
                            color: "#7054d1"
                        }]);
                        break;
                    case "ratio":
                        setAdaChartSeries([{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#424a7b"
                        },{
                            name: "RatioX",
                            data: chartData.ratio,
                            color: "#7054d1"
                        }]);
                        break;
                    default:
                        return;
                };
                break;
            case "Djed":
                setDjedSelected(newVal);
                switch (newVal) {
                    case "none":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "ada-price":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "djed-price":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "shen-price":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "reserves":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "Reserves",
                            data: chartData.ada_reserve,
                            color: "#7054d1"
                        }]);
                        break;
                    case "liabilities":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "Liabilities",
                            data: chartData.liabilities,
                            color: "#7054d1"
                        }]);
                        break;
                    case "equity":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "Equity",
                            data: chartData.equity,
                            color: "#7054d1"
                        }]);
                        break;
                    case "ratio":
                        setDjedChartSeries([{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#424a7b"
                        },{
                            name: "RatioX",
                            data: chartData.ratio,
                            color: "#7054d1"
                        }]);
                        break;
                    default:
                        return;
                }
                break;
            case "Shen":
                setShenSelected(newVal);
                switch (newVal) {
                    case "none":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "ada-price":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "djed-price":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "shen-price":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        }]);
                        break;
                    case "reserves":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "Reserves",
                            data: chartData.ada_reserve,
                            color: "#7054d1"
                        }]);
                        break;
                    case "liabilities":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "Liabilities",
                            data: chartData.liabilities,
                            color: "#7054d1"
                        }]);
                        break;
                    case "equity":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "Equity",
                            data: chartData.equity,
                            color: "#7054d1"
                        }]);
                        break;
                    case "ratio":
                        setShenChartSeries([{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#424a7b"
                        },{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#7054d1"
                        }]);
                        break;
                    default:
                        return;
                }
                break;
            case "Ratio":
                setRatioSelected(newVal);
                switch (newVal) {
                    case "none":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        }]);
                        break;
                    case "ada-price":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "ADA Price",
                            data: chartData.ada_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "djed-price":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "Djed Price",
                            data: chartData.djed_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "shen-price":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "Shen Price",
                            data: chartData.shen_price,
                            color: "#7054d1"
                        }]);
                        break;
                    case "reserves":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "Reserves",
                            data: chartData.ada_reserve,
                            color: "#7054d1"
                        }]);
                        break;
                    case "liabilities":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "Liabilities",
                            data: chartData.liabilities,
                            color: "#7054d1"
                        }]);
                        break;
                    case "equity":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        },{
                            name: "Equity",
                            data: chartData.equity,
                            color: "#7054d1"
                        }]);
                        break;
                    case "ratio":
                        setRatioChartSeries([{
                            name: "Ratio",
                            data: chartData.ratio,
                            color: "#424a7b"
                        }]);
                        break;
                    default:
                        return;
                }
                break;
            default:
                return;
        }
    }

    return (
        <div>
            <Head>
                <title>Djed Dashboard: Historical</title>
                <meta name="description" content="A historical perspecitve of the Djed protocol's state. Metrics include ADA, Djed, and Shen price, circulating supply and reserve health." />
            </Head>
            <div className="margin20">
                <div className="regular-text container padding-20">
                    <p className="primary-color">{disclaimer}</p>
                </div>
                <div className="margin-auto">
                    <Tabs variant="underlined" aria-label="Options" color="primary">
                        <Tab key="ADA-price" title="ADA Price">
                            {!!chartData ? (
                                <div>
                                    <XTimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} series={adaChartSeries} />
                                    <RadioGroup 
                                        label="Overlay data: "
                                        orientation="horizontal"
                                        value={adaSelected}
                                        onValueChange={(newVal) => {
                                            onDataOverlayChange("ADA", newVal);
                                        }}
                                        className="regular-text"
                                    >
                                        <Radio value="none">
                                            <p className="regular-text primary-color">None</p>
                                        </Radio>
                                        <Radio value="ada-price">
                                            <p className="regular-text primary-color">ADA Price</p>
                                        </Radio>
                                        <Radio value="djed-price">
                                            <p className="regular-text primary-color">Djed Price</p>
                                        </Radio>
                                        <Radio value="shen-price">
                                            <p className="regular-text primary-color">Shen Price</p>
                                        </Radio>
                                        <Radio value="reserves">
                                            <p className="regular-text primary-color">Reserves</p>
                                        </Radio>
                                        <Radio value="liabilities">
                                            <p className="regular-text primary-color">Liabilities</p>
                                        </Radio>
                                        <Radio value="equity">
                                            <p className="regular-text primary-color">Equity</p>
                                        </Radio>
                                        <Radio value="ratio">
                                            <p className="regular-text primary-color">Ratio</p>
                                        </Radio>
                                    </RadioGroup>
                                </div>
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Djed-price" title="Djed Price">
                            {!!chartData ? (
                                <div>
                                    <XTimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} series={djedChartSeries} />
                                    <RadioGroup 
                                        label="Overlay data: "
                                        orientation="horizontal"
                                        value={djedSelected}
                                        onValueChange={(newVal) => {
                                            onDataOverlayChange("Djed", newVal);
                                        }}
                                        className="regular-text"
                                    >
                                        <Radio value="none">
                                            <p className="regular-text primary-color">None</p>
                                        </Radio>
                                        <Radio value="ada-price">
                                            <p className="regular-text primary-color">ADA Price</p>
                                        </Radio>
                                        <Radio value="djed-price">
                                            <p className="regular-text primary-color">Djed Price</p>
                                        </Radio>
                                        <Radio value="shen-price">
                                            <p className="regular-text primary-color">Shen Price</p>
                                        </Radio>
                                        <Radio value="reserves">
                                            <p className="regular-text primary-color">Reserves</p>
                                        </Radio>
                                        <Radio value="liabilities">
                                            <p className="regular-text primary-color">Liabilities</p>
                                        </Radio>
                                        <Radio value="equity">
                                            <p className="regular-text primary-color">Equity</p>
                                        </Radio>
                                        <Radio value="ratio">
                                            <p className="regular-text primary-color">Ratio</p>
                                        </Radio>
                                    </RadioGroup>
                                </div>
                            ) : (
                                <div>
                                    <p>No chart data</p>
                                </div>
                            )}
                        </Tab>
                        <Tab key="Shen-price" title="Shen Price">
                            {!!chartData ? (
                                <div>
                                    <XTimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} series={shenChartSeries} />
                                    <RadioGroup 
                                        label="Overlay data: "
                                        orientation="horizontal"
                                        value={shenSelected}
                                        onValueChange={(newVal) => {
                                            onDataOverlayChange("Shen", newVal);
                                        }}
                                        className="regular-text"
                                    >
                                        <Radio value="none">
                                            <p className="regular-text primary-color">None</p>
                                        </Radio>
                                        <Radio value="ada-price">
                                            <p className="regular-text primary-color">ADA Price</p>
                                        </Radio>
                                        <Radio value="djed-price">
                                            <p className="regular-text primary-color">Djed Price</p>
                                        </Radio>
                                        <Radio value="shen-price">
                                            <p className="regular-text primary-color">Shen Price</p>
                                        </Radio>
                                        <Radio value="reserves">
                                            <p className="regular-text primary-color">Reserves</p>
                                        </Radio>
                                        <Radio value="liabilities">
                                            <p className="regular-text primary-color">Liabilities</p>
                                        </Radio>
                                        <Radio value="equity">
                                            <p className="regular-text primary-color">Equity</p>
                                        </Radio>
                                        <Radio value="ratio">
                                            <p className="regular-text primary-color">Ratio</p>
                                        </Radio>
                                    </RadioGroup>
                                </div>
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
                                <div>
                                    <XTimeSeriesChart xSeries={helper.convertUnixTimestampsToDateStrings(chartData.x)} series={ratioChartSeries} />
                                    <RadioGroup 
                                        label="Overlay data: "
                                        orientation="horizontal"
                                        value={ratioSelected}
                                        onValueChange={(newVal) => {
                                            onDataOverlayChange("Ratio", newVal);
                                        }}
                                        className="regular-text"
                                    >
                                        <Radio value="none">
                                            <p className="regular-text primary-color">None</p>
                                        </Radio>
                                        <Radio value="ada-price">
                                            <p className="regular-text primary-color">ADA Price</p>
                                        </Radio>
                                        <Radio value="djed-price">
                                            <p className="regular-text primary-color">Djed Price</p>
                                        </Radio>
                                        <Radio value="shen-price">
                                            <p className="regular-text primary-color">Shen Price</p>
                                        </Radio>
                                        <Radio value="reserves">
                                            <p className="regular-text primary-color">Reserves</p>
                                        </Radio>
                                        <Radio value="liabilities">
                                            <p className="regular-text primary-color">Liabilities</p>
                                        </Radio>
                                        <Radio value="equity">
                                            <p className="regular-text primary-color">Equity</p>
                                        </Radio>
                                        <Radio value="ratio">
                                            <p className="regular-text primary-color">Ratio</p>
                                        </Radio>
                                    </RadioGroup>
                                </div>
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
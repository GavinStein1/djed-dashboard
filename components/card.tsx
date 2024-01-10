import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import TimeSeriesChart from "./timeseries-chart";

interface MyComponentProps {
    dataName: string;
    dataValue: string;
    dataGroup: string;
    hasChart: boolean;
    chartXData: string[];
    chartYData: number[];
}

const CardComponent: React.FC<MyComponentProps> = ({ dataName, dataValue, dataGroup, hasChart, chartXData, chartYData }) => {
    return (
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">{dataGroup}</p>
            <h4 className="font-bold text-large">{dataName}</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            {dataValue}
          </CardBody>
          <TimeSeriesChart xSeries={chartXData} ySeries={chartYData} title={dataName}/>
        </Card>
    )
}

export default CardComponent;
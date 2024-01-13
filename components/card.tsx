import {Card, CardHeader, CardBody, Tooltip} from "@nextui-org/react";
import { ReactNode } from "react";

interface MyComponentProps {
    header2: string;
    bodyValue: string;
    header1: string;
    tooltip: string;
    children: ReactNode
}

const CardComponent: React.FC<MyComponentProps> = ({ header2, bodyValue, header1, tooltip, children }) => {
    return (
        <Card className="py-4 margin20 primary-color">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">{header1}</p>
            <h4 className="font-bold text-large">{header2}</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            {tooltip !== "" ? (
              <Tooltip content={tooltip}>
                <p>{bodyValue}</p>
              </Tooltip>
            ): (
              <div>
                {bodyValue}
              </div>
            )}
          </CardBody>
          <div className="children-padding">
            {children}
          </div>
        </Card>
    )
}

export default CardComponent;
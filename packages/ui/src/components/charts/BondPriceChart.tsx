import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BondPriceChartTooltip } from "./BondPriceChartTooltip";
import { formatCurrency, formatDate } from "utils";

export type BondPriceDatapoint = {
  date?: string | number;
  price?: string | number;
  discountedPrice?: string | number;
};

export type BondPriceChartProps = {
  data: Array<BondPriceDatapoint>;
  payoutTokenSymbol: string;
  className?: string;
};

const getBottomDomain = (min: number) => min - min / 90;
const getTopDomain = (max: number) => max + max / 90;

export const BondPriceChart = (props: BondPriceChartProps) => {
  if (!props.data.length) {
    return <div className="h-full w-full" />;
  }

  return (
    <div className={`h-full w-full ${props.className}`}>
      <ResponsiveContainer>
        <Chart data={props.data}>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate.dayMonthTime}
            dx={-6}
            tickLine={false}
          />
          <YAxis
            tickLine={false}
            domain={[getBottomDomain, getTopDomain]}
            tickFormatter={formatCurrency.dynamicFormatter}
          />
          <Line dot={false} stroke="#40749b" dataKey="price" />
          <Line dot={false} stroke="#F2A94A" dataKey="discountedPrice" />
          <Tooltip
            wrapperStyle={{ outline: "none", backgroundColor: "transparent" }}
            content={
              <BondPriceChartTooltip tokenSymbol={props.payoutTokenSymbol} />
            }
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

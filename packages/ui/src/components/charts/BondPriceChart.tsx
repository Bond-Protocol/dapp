import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BondPriceChartTooltip } from "./BondPriceChartTooltip";
import { formatCurrency, formatDate } from "utils";

export type BondPriceDatapoint = {
  date?: number;
  price?: number;
  discountedPrice?: number;
  discount?: string | number;
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
            tickLine={false}
            minTickGap={80}
          />
          <YAxis
            tickLine={false}
            domain={[getBottomDomain, getTopDomain]}
            tickFormatter={formatCurrency.dynamicFormatter}
          />
          <CartesianGrid stroke="#404040" vertical={false} />
          <Line dot={false} strokeWidth={2} stroke="#40749b" dataKey="price" />
          <Line
            dot={false}
            stroke="#F2A94A"
            dataKey="discountedPrice"
            strokeDasharray="6 2"
            strokeWidth={2}
          />
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

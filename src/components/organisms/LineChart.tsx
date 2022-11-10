import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BondDiscountTooltip } from "./BondDiscountTooltip";

export type BondDiscountData = {
  date: number;
  price: number;
  discountedPrice: number;
  discount?: number;
};

export type LineChartData = Array<{ label: string; data: BondDiscountData[] }>;
export type ChartProps = {
  data: LineChartData;
};

export type BondChartDataset = {
  price: number;
  discount: number;
  discountedPrice: number;
  date: Date;
};

const getBottomPadding = (min: number) => min - min / 90;
const getTopPadding = (max: number) => max + max / 90;

export const LineChart = (props: ChartProps) => {
  return (
    <div className="h-full min-h-[20vh] min-w-[25vw] border-b border-l border-light-primary-50/10">
      <ResponsiveContainer>
        <Chart data={props.data}>
          <XAxis hide dataKey="date" tickLine={false} padding={{ right: 10 }} />
          <YAxis
            hide
            domain={[getBottomPadding, getTopPadding]}
            tickFormatter={(t) => Number(t).toPrecision(4)}
          />
          <Tooltip
            content={<BondDiscountTooltip tokenSymbol="ETH" />}
            wrapperStyle={{ outline: "none", backgroundColor: "transparent" }}
          />
          <Line dot={false} stroke="#40749b" dataKey="price" />
          <Line dot={false} stroke="#F2A94A" dataKey="discountedPrice" />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

import { fromUnixTime, format } from "date-fns";
import { forwardRef } from "react";
import {
  LineChart as Chart,
  Line as UnstyledLine,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineProps,
} from "recharts";

export type PriceData = { date: number; price: number };
export type LineChartData = Array<{ label: string; data: PriceData[] }>;
export type ChartProps = {
  data: LineChartData;
};

const getBottomPadding = (min) => min - min / 90;
const getTopPadding = (max) => max + max / 90;
const getDiscountColor = (price, discount) => {
  if (price === discount) return "text-white";
  return price > discount ? "text-light-success" : "text-red-400";
};

const settings = [
  { dataKey: "discount", name: "Discount", fill: "#40749b" },
  { datakey: "price", name: "Price", fill: "#F2A94A" },
];

const TooltipLabel = (props: {
  value: number;
  label: string;
  className: string;
  color: string;
}) => {
  return (
    <div
      className={`flex w-full justify-between text-light-secondary ${props.className}`}
    >
      <p className="">{props.label}</p>
      <p className={`w-1/3 pr-4 text-left text-white ${props.color}`}>
        {props.value}
      </p>
    </div>
  );
};

const Tooltips = (props, ...rest) => {
  const [data] = props?.payload || {};
  const price = data?.payload.price || 0;
  const discount = data?.payload.discount || 0;
  const date = data?.payload.date || Date.now();

  return (
    <div className="min-w-[100px] rounded-lg border border-transparent bg-light-tooltip p-2 py-1 font-jakarta text-xs font-extralight">
      <TooltipLabel
        value={"$" + price.toFixed(2)}
        label={`${props.token} Price: `}
        className="mt-2 text-light-secondary"
        color=""
      />
      <TooltipLabel
        value={"$" + discount.toFixed(2)}
        label="Bond Price: "
        className="text-light-primary"
        color={getDiscountColor(price, discount)}
      />
      <div className="mt-2 text-center text-[10px] text-light-primary-50">
        {format(date, "yyyy-MM-dd HH:MM:ss")}
      </div>
    </div>
  );
};

export const LineChart = (props: ChartProps) => {
  return (
    <div className="h-[35vh] max-h-[35vh] w-[40vw] max-w-[40vw] border">
      <ResponsiveContainer>
        <Chart data={props.data}>
          <XAxis hide dataKey="date" tickLine={false} padding={{ right: 10 }} />
          <YAxis
            hide
            domain={[getBottomPadding, getTopPadding]}
            tickFormatter={(t) => {
              return Number(t).toPrecision(4);
            }}
          />
          <Tooltip
            content={<Tooltips token="OHM" />}
            wrapperStyle={{
              outline: "none",
              backgroundColor: "transparent",
            }}
          />
          <UnstyledLine
            isAnimationActive={false}
            dot={false}
            stroke="#F2A94A"
            dataKey="price"
          />
          <UnstyledLine dot={false} stroke="#40749b" dataKey="discount" />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

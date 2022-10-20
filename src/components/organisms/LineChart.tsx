import { format } from "date-fns";
import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const getBottomPadding = (min: number) => min - min / 90;
const getTopPadding = (max: number) => max + max / 90;
const getDiscountColor = (price: number, discount: number) => {
  if (price === discount) return "text-white";
  return price > discount ? "text-light-success" : "text-red-400";
};

const TooltipLabel = (props: {
  value: string;
  label: string;
  className: string;
  valueClassName?: string;
}) => {
  return (
    <div className={`flex w-full justify-between ${props.className}`}>
      <p className="w-1/2">{props.label}</p>
      <p className={`text-left text-white ${props.valueClassName}`}>
        {props.value}
      </p>
    </div>
  );
};

export type BondChartDataset = {
  price: number;
  discount: number;
  discountedPrice: number;
  date: Date;
};

export type ChartTooltipProps = {
  tokenSymbol: string;
  payload?: Array<{ payload: BondChartDataset }>;
};

const Tooltips = (props: ChartTooltipProps) => {
  const [data] = props.payload || [];
  const price = data?.payload.price || 0;
  const discount = data?.payload.discount || 0;
  const discountedPrice = data?.payload.discountedPrice || 0;
  const date = data?.payload.date || Date.now();

  return (
    <div className="min-w-[150px] rounded-lg border border-transparent bg-light-tooltip p-2 py-1 font-jakarta text-xs font-extralight">
      <TooltipLabel
        value={"$" + price.toFixed(2)}
        label={`${props.tokenSymbol} Price: `}
        className="mt-2 text-light-primary"
        valueClassName=""
      />
      <TooltipLabel
        value={"$" + discountedPrice.toFixed(2)}
        label="Bond Price: "
        className="text-light-secondary"
      />
      <TooltipLabel
        value={`${discount.toFixed(2)}%`}
        label={`Discount: `}
        className="text-white"
        valueClassName={`${getDiscountColor(
          price,
          discountedPrice
        )} text-right`}
      />
      <div className="mt-2 text-[10px] text-light-primary-50">
        {format(date, "yyyy-MM-dd HH:MM:ss")}
      </div>
    </div>
  );
};

export const LineChart = (props: ChartProps) => {
  return (
    <div className="h-full min-h-[20vh] min-w-[25vw] border-b border-l border-light-primary-50/10">
      <ResponsiveContainer>
        <Chart data={props.data}>
          <XAxis hide dataKey="date" tickLine={false} padding={{ right: 10 }} />
          <XAxis
            hide
            dataKey="discountDate"
            tickLine={false}
            padding={{ right: 10 }}
          />
          <YAxis
            hide
            domain={[getBottomPadding, getTopPadding]}
            tickFormatter={(t) => {
              return Number(t).toPrecision(4);
            }}
          />
          <Tooltip
            content={<Tooltips tokenSymbol="OHM" />}
            wrapperStyle={{ outline: "none", backgroundColor: "transparent" }}
          />
          <Line dot={false} stroke="#40749b" dataKey="price" />
          <Line dot={false} stroke="#F2A94A" dataKey="discountedPrice" />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

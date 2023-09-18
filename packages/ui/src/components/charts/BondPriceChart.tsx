import {
  CartesianGrid,
  Line,
  LineChart as Chart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BondPriceChartTooltip } from "./BondPriceChartTooltip";
import { calculateTrimDigits, formatDate, trim } from "utils";

export type BondPriceDatapoint = {
  price?: number;
  timestamp?: number;
  discountedPrice?: number;
  discount?: string | number;
};

export type BondPriceChartProps = {
  data: Array<BondPriceDatapoint>;
  payoutTokenSymbol: string;
  quoteTokenSymbol?: string;
  useTokenRatio?: boolean;
  className?: string;
  disableTooltip?: boolean;
  id?: string;
};

export const BondPriceChart = (props: BondPriceChartProps) => {
  if (!props.data.length) {
    return <div className="h-full w-full" />;
  }

  const [last] = props.data.slice(-1);

  return (
    <div className={`group relative z-10 h-full w-full ${props.className}`}>
      {!props.disableTooltip && (
        <>
          <div className="border-light-grey-400 absolute right-1 top-4 z-20 h-[87%] border-l transition-all group-hover:opacity-0 group-hover:transition-none" />
          <div className="absolute right-0 top-0 z-20 mt-1 transition-all group-hover:opacity-0">
            <BondPriceChartTooltip
              id="fixed"
              payoutTokenSymbol={props.payoutTokenSymbol}
              quoteTokenSymbol={props.quoteTokenSymbol}
              useTokenRatio={props.useTokenRatio}
              payload={[{ payload: last }]}
            />
          </div>
        </>
      )}
      <ResponsiveContainer minWidth={300} minHeight={260}>
        <Chart data={props.data}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate.dayMonthTime}
            tickLine={false}
            minTickGap={80}
            type={"number"}
            scale={"time"}
            domain={["auto", "auto"]}
          />
          <YAxis
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(value) =>
              `$${trim(value, calculateTrimDigits(value))}`
            }
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
          {!props.disableTooltip && (
            <Tooltip
              wrapperStyle={{ outline: "none", backgroundColor: "transparent" }}
              content={
                <BondPriceChartTooltip
                  payoutTokenSymbol={props.payoutTokenSymbol}
                  quoteTokenSymbol={props.quoteTokenSymbol}
                  useTokenRatio={props.useTokenRatio}
                />
              }
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

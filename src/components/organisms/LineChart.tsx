import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateRange } from "../../utils/interpolate-price";

export type BondDiscountData = {
  date: number;
  price: number;
  discountedPrice: number;
  discount?: number;
};

export type BondChartDataset = {
  price: number;
  discount: number;
  discountedPrice: number;
  date: Date | number;
};

export type ChartProps = {
  tooltip?: any;
  data: any[];
  xAxisTicks?: any[];
  yAxisTicks?: any[];
};

const getBottomPadding = (min: number) => min - min / 90;
const getTopPadding = (max: number) => max + max / 90;

const CustomTick = ({
  xAxis,
  elements,
}: {
  xAxis?: boolean;
  elements?: any[];
}) => {
  const style = xAxis
    ? "h-min justify-evenly pt-0.5 "
    : "flex-col border-r py-4";

  return (
    <div
      className={`flex h-full justify-between border-light-primary-100 text-xs ${style} opacity-60`}
    >
      {elements?.map((e) => (
        <div className="pr-0.5 text-[10px] text-light-primary-100">{e}</div>
      ))}
    </div>
  );
};

export const generateTicks = (entries: number[], size: number) => {
  const set = new Set(entries);
  const min = Math.min(...set);
  const max = Math.max(...set);
  return [min, ...generateRange(min, max, size), max];
};

export const LineChart = (props: ChartProps) => {
  return (
    <>
      <div className="flex h-full">
        <CustomTick elements={props.yAxisTicks} />
        <div className="h-full min-h-[20vh] w-full min-w-[25vw] border-b border-light-primary-100/60">
          <ResponsiveContainer>
            <Chart data={props.data}>
              <XAxis hide dataKey="date" scale="time" />
              <YAxis hide domain={[getBottomPadding, getTopPadding]} />
              <Line dot={false} stroke="#40749b" dataKey="price" />
              <Line dot={false} stroke="#F2A94A" dataKey="discountedPrice" />
              <Tooltip
                content={props.tooltip}
                wrapperStyle={{
                  outline: "none",
                  backgroundColor: "transparent",
                }}
              />
            </Chart>
          </ResponsiveContainer>
        </div>
      </div>
      <CustomTick xAxis elements={props.xAxisTicks} />
    </>
  );
};

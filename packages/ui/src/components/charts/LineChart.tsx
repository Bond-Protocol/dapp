import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { dynamicFormatter } from "utils/format";

export const generateRange = (min: number, max: number, distance: number) => {
  const gapAmount = (max - min) / (distance + 1);
  return Array(distance)
    .fill(min)
    .map((min, i) => min + gapAmount * (i + 1));
};

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
  data: any[];
  tooltip?: any;
  xAxisLabels?: any[];
  yAxisLabels?: any[];
};

const getBottomDomain = (min: number) => min - min / 90;
const getTopDomain = (max: number) => max + max / 90;

const CustomTick = ({
  xAxis,
  elements,
}: {
  xAxis?: boolean;
  elements?: any[];
}) => {
  const style = xAxis ? "h-min pt-0.5 pl-8 border-t" : "flex-col border-r pb-2";

  return (
    <div
      className={`border-light-primary-100/20 flex h-full justify-between text-xs ${style} opacity-60`}
    >
      {elements?.map((e, i) => (
        <div key={i} className="text-light-primary-100 pr-0.5 text-[10px]">
          {e}
        </div>
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

const Tick = ({ dy = 0, dx = 0, formatter = (v) => v, ...props }) => {
  const { x, y, payload } = props;

  const value = formatter(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={dy}
        dx={dx}
        className="font-jakarta text-[10px] font-extralight"
        textAnchor="end"
        fill="#666"
      >
        {value}
      </text>
    </g>
  );
};

export const LineChart = (props: ChartProps) => {
  if (!props.data.length) {
    return <div />;
  }

  return (
    <>
      <div className="flex">
        {props.yAxisLabels && <CustomTick elements={props.yAxisLabels} />}
        <div className="min-h-[35vh] min-w-[40vw]">
          <ResponsiveContainer className="-mb-8">
            <Chart data={props.data}>
              <XAxis
                tickLine={false}
                dataKey="date"
                scale="time"
                tick={
                  <Tick dy={4} formatter={(date) => format(date, "MM/dd p")} />
                }
              />
              <YAxis
                tickLine={false}
                dx={4}
                tick={<Tick formatter={dynamicFormatter} />}
                domain={[getBottomDomain, getTopDomain]}
              />
              <Line dot={false} stroke="#40749b" dataKey="price" />
              <Line dot={false} stroke="#F2A94A" dataKey="discountedPrice" />
              {props.tooltip && (
                <Tooltip
                  content={props.tooltip}
                  wrapperStyle={{
                    outline: "none",
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      </div>
      {props.xAxisLabels && <CustomTick xAxis elements={props.xAxisLabels} />}
    </>
  );
};

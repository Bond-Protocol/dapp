import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const getBottomPadding = (min: number) => min - min / 90;
const getTopPadding = (max: number) => max + max / 90;

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

export const LineChart = (props: ChartProps) => {
  if (!props.data.length) {
    return <div />;
  }

  return (
    <>
      <div className="flex h-full">
        {props.yAxisLabels && <CustomTick elements={props.yAxisLabels} />}
        <div className="border-light-primary-100/20 h-full min-h-[20vh] w-full min-w-[25vw]">
          <ResponsiveContainer className="max-w-[500px]">
            <Chart data={props.data}>
              <XAxis
                hide
                tick={false}
                tickFormatter={() => "0"}
                dataKey="date"
                scale="time"
              />
              <YAxis
                hide
                tick={false}
                tickFormatter={() => "0"}
                domain={[getBottomPadding, getTopPadding]}
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

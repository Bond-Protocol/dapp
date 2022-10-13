import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { fromUnixTime } from "date-fns";

export type PriceData = { date: number; price: number };
export type LineChartData = Array<{ label: string; data: PriceData[] }>;
export type ChartProps = {
  data: LineChartData;
};

export const LineChart = (props: ChartProps) => {
  const primaryAxis = useMemo(
    (): AxisOptions<PriceData> => ({
      getValue: ({ date }) => fromUnixTime(date),
    }),
    [props.data]
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<PriceData>[] => [{ getValue: ({ price }) => price }],
    [props.data]
  );

  return (
    <div className="h-[30vh] max-w-[55vw]">
      <Chart
        options={{
          data: props.data,
          primaryAxis,
          secondaryAxes,
          secondaryCursor: false,
          dark: true,
        }}
      />
    </div>
  );
};

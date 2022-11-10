import { format } from "date-fns";
import { LineChart, generateTicks } from "./LineChart";
import { useBondChartData } from "hooks/useBondChartData";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondDiscountTooltip } from "./BondDiscountTooltip";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
};

export const BondDiscountChart = ({ market }: BondDiscountChartProps) => {
  const { dataset, isLoading } = useBondChartData(market);

  if (!dataset || isLoading) return <div />;

  const yAxis = generateTicks(
    dataset.flatMap((d) => [d.price, d.discountedPrice]),
    3
  )
    .sort((a, b) => b - a)
    .map((e) => "$" + e.toFixed(0));

  const xAxis = generateTicks(
    dataset.map((d) => d.date as number),
    2
  )
    .sort((a, b) => a - b)
    .map((x) => format(x, "MM/dd"));

  return (
    <LineChart
      data={dataset}
      xAxisTicks={xAxis}
      yAxisTicks={yAxis}
      tooltip={
        <BondDiscountTooltip tokenSymbol={market?.payoutToken?.symbol} />
      }
    />
  );
};

import { useState } from "react";
import { format } from "date-fns";
import { LineChart, generateTicks } from "./LineChart";
import { useBondChartData } from "hooks/useBondChartData";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondDiscountTooltip } from "./BondDiscountTooltip";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
};

const RangeSelector = ({
  ranges,
  selected,
  handleClick,
}: {
  ranges: SupportedRanges[];
  handleClick: (n: any) => void;
  selected: SupportedRanges;
}) => {
  return (
    <div className="flex justify-end gap-2 text-xs">
      {ranges.map((days) => (
        <button
          className={`bond-chip ${selected === days && "border-white/40"}`}
          onClick={() => handleClick(days)}
        >
          {days}D
        </button>
      ))}
    </div>
  );
};

type SupportedRanges = 1 | 3 | 7;
export const BondDiscountChart = ({ market }: BondDiscountChartProps) => {
  const [range, setRange] = useState<SupportedRanges>(3);
  const { dataset, isLoading } = useBondChartData(market, range);

  if (!dataset || isLoading) return <div />;

  const yAxis = generateTicks(
    dataset.flatMap((d) => [d.price, d.discountedPrice]),
    1
  )
    .sort((a, b) => b - a)
    .map((e) => "$" + e.toFixed(0));

  const xAxis = generateTicks(
    dataset.map((d) => d.date as number),
    3
  )
    .sort((a, b) => a - b)
    .map((x) => format(x, "MM/dd"));

  return (
    <>
      <LineChart
        data={dataset}
        xAxisTicks={xAxis}
        yAxisTicks={yAxis}
        tooltip={
          <BondDiscountTooltip tokenSymbol={market?.payoutToken?.symbol} />
        }
      />
      <RangeSelector
        ranges={[1, 3, 7]}
        selected={range}
        handleClick={(n: SupportedRanges) => setRange(n)}
      />
    </>
  );
};

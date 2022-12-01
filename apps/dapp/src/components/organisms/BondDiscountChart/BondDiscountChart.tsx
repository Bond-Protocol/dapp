import { add, format, isFuture, isBefore } from "date-fns";
import { useState } from "react";
import { LineChart, generateTicks } from "components/organisms/LineChart";
import { useBondChartData } from "hooks/useBondChartData";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondDiscountTooltip } from "./BondDiscountTooltip";
import { PlaceholderChart } from "../PlaceholderChart";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
  extraRanges?: number[];
};

const defaultRanges = [1, 3, 7];

export const BondDiscountChart = ({
  market,
  extraRanges = [],
}: BondDiscountChartProps) => {
  const marketCreationDate = new Date(market.creationBlockTimestamp * 1000);
  const isFirstDay = isBefore(Date.now(), add(marketCreationDate, { days: 1 }));

  const [days, setDays] = useState(isFirstDay ? 1 : 3);

  const { dataset, isLoading, purchases } = useBondChartData(market, days);

  if (isLoading) {
    return <div />;
  }

  //@ts-ignore
  // Could remove and update chart to show price previous to market opening
  if (!dataset || purchases?.length < 2 || market?.quoteToken?.lpPair) {
    return (
      <PlaceholderChart
        message={
          <>
            Performance data for <br />
            this market will be available soon
          </>
        }
      />
    );
  }

  const yAxisLabels = generateTicks(
    dataset.flatMap((d) => [d.price, d.discountedPrice]),
    2
  )
    .sort((a, b) => b - a)
    .map((e) => "$" + e.toFixed(0)); //TODO: Fix fox different values

  const xAxisLabels = generateTicks(
    dataset.map((d) => d.date as number),
    4
  ).map((x) => format(x, "MM/dd p"));

  const ranges = extraRanges.filter(
    (days: number) => !isFuture(add(marketCreationDate, { days }))
  );
  const allRanges = [...defaultRanges, ...ranges];

  return (
    <div className="flex w-full flex-col">
      <LineChart
        data={dataset}
        xAxisLabels={xAxisLabels}
        yAxisLabels={yAxisLabels}
        tooltip={
          <BondDiscountTooltip tokenSymbol={market?.payoutToken?.symbol} />
        }
      />
      <div className="mt-1 flex justify-end gap-2 text-xs">
        {allRanges.map((element) => (
          <button
            className={`bond-chip ${days === element && "border-white/40"}`}
            onClick={() => setDays(element)}
          >
            {element + "D"}
          </button>
        ))}
      </div>
    </div>
  );
};

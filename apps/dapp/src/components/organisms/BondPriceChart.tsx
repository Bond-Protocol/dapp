import { BondPriceChart as BaseBondPriceChart, Chip } from "ui";
import { useBondChartData } from "hooks/useBondChartData";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { PlaceholderChart } from "./PlaceholderChart";
import { useState } from "react";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
  extraRanges?: number[];
};

export const BondPriceChart = ({ market }: BondDiscountChartProps) => {
  const [range, setRange] = useState(7);
  const { dataset, isLoading, purchases } = useBondChartData(market, range);

  if (isLoading || !purchases) {
    return <div />;
  }

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

  return (
    <div className="flex h-full w-full flex-col">
      <BaseBondPriceChart
        data={dataset}
        payoutTokenSymbol={market.payoutToken.symbol}
      />
      <div className="flex justify-end gap-x-0.5">
        <Chip selected={range === 1} onClick={(_e) => setRange(1)}>
          1D
        </Chip>
        <Chip selected={range === 3} onClick={(_e) => setRange(3)}>
          3D
        </Chip>
        <Chip selected={range === 7} onClick={(_e) => setRange(7)}>
          7D
        </Chip>
        <Chip selected={range === 30} onClick={(_e) => setRange(30)}>
          30D
        </Chip>
      </div>
    </div>
  );
};

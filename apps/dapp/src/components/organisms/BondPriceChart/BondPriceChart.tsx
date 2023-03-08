import { BondPriceChart as BaseBondPriceChart } from "ui";
import { useBondChartData } from "hooks/useBondChartData";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { PlaceholderChart } from "../PlaceholderChart";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
  extraRanges?: number[];
};

export const BondPriceChart = ({ market }: BondDiscountChartProps) => {
  const { dataset, isLoading, purchases } = useBondChartData(market);

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
    <BaseBondPriceChart
      data={dataset}
      payoutTokenSymbol={market.payoutToken.symbol}
    />
  );
};

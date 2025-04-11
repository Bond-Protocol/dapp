import { useNavigate } from "react-router-dom";
import {
  BondPriceChart,
  formatCurrency,
  InfoLabel,
  PlaceholderChart,
} from "ui";
import { PageHeader, PageNavigation } from "components/common";
import { getMarketLabels } from "hooks/useMarketDetails";
import { Market } from "src/generated/graphql";
import { useClosedMarketChart } from "hooks/useBondChartData";
import { MarketTransactionHistory } from "components/lists/MarketTransactionHistory";

type MarketTotals = {
  quoteToken: Pick<Market, "quoteToken"> & { logoUrl: string };
  payoutToken: Pick<Market, "payoutToken"> & { logoUrl: string };
  total: {
    quoteUsd: number;
    payoutUsd: number;
    quote: number;
    payout: number;
    avgPrice: number;
  };
};
export type PastMarket = Market & MarketTotals;

export const ClosedMarket = ({ market }: { market: PastMarket }) => {
  const navigate = useNavigate();
  const marketTypeLabel = getMarketLabels(market);
  const { dataset, pricedPurchases } = useClosedMarketChart(market);

  const avgDiscount =
    pricedPurchases.reduce((total, element) => total + element.discount, 0) /
    pricedPurchases.length;

  const discount = avgDiscount.toFixed(2);

  return (
    <div className="pb-4">
      <PageNavigation
        rightText="View Token"
        onClickLeft={() => navigate(-1)}
        onClickRight={() =>
          navigate(
            `/tokens/${market.payoutToken?.chainId}/${market.payoutToken?.address}`
          )
        }
      >
        <PageHeader
          title={`${market.payoutToken?.symbol} BOND`}
          subtitle={marketTypeLabel}
          //@ts-ignore
          icon={market.payoutToken?.logoURI}
          className="place-self-start self-start justify-self-start"
        />
      </PageNavigation>
      <div className="mb-4 mt-4 grid grid-cols-2 justify-between gap-4 child:w-full md:flex">
        <InfoLabel label="Total Payout">
          {formatCurrency.dynamicFormatter(market?.total?.payout, false)}
          <span className="ml-1 text-xl">{market.payoutToken.symbol}</span>
        </InfoLabel>

        <InfoLabel label="Total Intake">
          {formatCurrency.dynamicFormatter(market?.total?.quote, false)}
          <span className="ml-1 text-xl">{market.quoteToken.symbol}</span>
        </InfoLabel>
      </div>

      <div className="mb-16 grid grid-cols-2 justify-between gap-4 child:w-full md:flex">
        <InfoLabel label="Total Bonds">
          {market.bondPurchases?.length}
        </InfoLabel>
        <InfoLabel label="Average Exchange Rate">
          {formatCurrency.trimToken(market.total?.avgPrice ?? 0)}
          <span className="ml-1 text-xl">
            {market.quoteToken.symbol} per {market.payoutToken.symbol}
          </span>
        </InfoLabel>

        <InfoLabel
          label="Average Discount"
          className={avgDiscount > 0 ? "text-light-success" : "text-red-300"}
        >
          {isFinite(avgDiscount) ? `${discount}%` : "-"}
        </InfoLabel>
      </div>

      {dataset.length > 2 ? (
        <PlaceholderChart message="Loading performance data" />
      ) : (
        <BondPriceChart
          data={dataset}
          payoutTokenSymbol={market.payoutToken.symbol}
        />
      )}

      <MarketTransactionHistory className="mt-20" market={market} />
    </div>
  );
};

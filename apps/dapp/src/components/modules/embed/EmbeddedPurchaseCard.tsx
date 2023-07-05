import { BondPurchaseCard } from "components/organisms";
import { useMarkets } from "context/market-context";
import { useMarketDetails } from "hooks/useMarketDetails";
import { useParams } from "react-router-dom";
import { SummaryLabel } from "ui";

export const EmbeddedPurchaseCard = () => {
  const { id, chainId } = useParams();
  const { getByChainAndId } = useMarkets();
  const market = getByChainAndId(chainId!, id!);
  const details = useMarketDetails(market);

  return (
    <div className="w-full">
      <div className="flex gap-x-1 pb-2">
        <SummaryLabel
          className="w-full"
          small
          subtext="DISCOUNT"
          value={details.discountLabel ?? ""}
        />
        <SummaryLabel
          className="w-full"
          small
          subtext={market.payoutToken.symbol + " BOND PRICE"}
          value={market.formattedDiscountedPrice}
        />
      </div>
      <BondPurchaseCard market={market} />
    </div>
  );
};

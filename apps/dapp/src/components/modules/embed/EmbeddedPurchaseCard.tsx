import { CalculatedMarket } from "@bond-protocol/types";
import { BondPriceLabel } from "components/common/BondPriceLabel";
import { BondPurchaseCard } from "components/organisms";
import { useMarkets } from "hooks";
import { useMarketDetails } from "hooks/useMarketDetails";
import { useParams } from "react-router-dom";
import { SummaryLabel, getDiscountColor } from "ui";

export const EmbeddedPurchaseCard = (props: { market?: CalculatedMarket }) => {
  const { id, chainId } = useParams();
  const { getByChainAndId } = useMarkets();
  const market = props.market ?? getByChainAndId(chainId!, id!)!;
  const details = useMarketDetails(market);

  return (
    <div className="w-full">
      <div className="flex h-full gap-x-1 pb-2">
        <BondPriceLabel
          {...market.payoutToken}
          bondPrice={market.formatted.discountedPrice}
          price={market.payoutToken.price ?? 0}
        />
        <SummaryLabel
          tooltip="The current discount available from this market. Green = discount, buy. Red = premium, do not buy."
          className="h-full w-full "
          valueClassName={`${getDiscountColor(
            market.payoutToken.price ?? 0,
            market.discountedPrice
          )} font-bold`}
          center
          subtext="DISCOUNT"
          value={details.discountLabel ?? ""}
        />
      </div>
      <BondPurchaseCard market={market} />
    </div>
  );
};

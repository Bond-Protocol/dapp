import { MarketList } from "components/lists";
import { useMarkets } from "context/market-context";
import { useSearchParams } from "react-router-dom";
import { useEmbedContext } from "./embed-context";
import { EmbeddedPurchaseCard } from "./EmbeddedPurchaseCard";

export const EmbeddedMarkets = () => {
  const [params] = useSearchParams();
  const { ownerAddress } = useEmbedContext();

  const owner = params.get("owner") ?? ownerAddress;

  const { getMarketsForOwner } = useMarkets();
  const markets = getMarketsForOwner(owner);

  if (markets.length === 1) {
    return <EmbeddedPurchaseCard market={markets[0]} />;
  }

  return (
    <div>
      <MarketList owner={owner} />
    </div>
  );
};

import { BondPurchaseCard } from "components/organisms";
import { useMarkets } from "context/market-context";
import { useParams } from "react-router-dom";

export const EmbeddedPurchaseCard = () => {
  const { id, chainId } = useParams();
  const { getByChainAndId } = useMarkets();
  const market = getByChainAndId(chainId!, id!);

  return (
    <div>
      <BondPurchaseCard market={market} />
    </div>
  );
};

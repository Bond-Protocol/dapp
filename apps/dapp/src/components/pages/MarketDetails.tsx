import { useParams } from "react-router-dom";
import { useMarkets } from "hooks";
import { Loading } from "ui";
import { ClosedMarket, PastMarket } from "components/organisms/ClosedMarket";
import { Market } from "components/organisms/Market";

export const MarketDetails = () => {
  const { id, chainId } = useParams();

  const { allMarkets: markets, closedMarkets } = useMarkets();

  const allMarkets = [...markets, ...closedMarkets];

  const market = allMarkets.find(
    ({ marketId, chainId: marketChainId }) =>
      //@ts-ignore
      marketId == id && marketChainId === chainId
  )!;

  if (!market) return <Loading />;

  const hasClosed =
    //@ts-ignore
    market?.hasClosed ||
    Number(market?.conclusion) * 1000 < new Date().getTime();

  return hasClosed ? (
    <ClosedMarket market={market as PastMarket} />
  ) : (
    <Market />
  );
};

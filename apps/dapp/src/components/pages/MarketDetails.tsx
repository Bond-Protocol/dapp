import { useParams } from "react-router-dom";
import { useMarkets } from "context/market-context";
import { CalculatedMarket } from "types";
import { Loading } from "ui";
import { ClosedMarket, PastMarket } from "components/organisms/ClosedMarket";
import { Market } from "components/organisms/Market";

export const MarketDetails = () => {
  const { id, chainId } = useParams();

  const { allMarkets: markets, closedMarkets } = useMarkets();

  const allMarkets = [...markets, ...closedMarkets];

  const market: CalculatedMarket | PastMarket = allMarkets.find(
    ({ marketId, chainId: marketChainId }) =>
      //@ts-ignore
      marketId == id && marketChainId === chainId
  )!;

  if (!market) return <Loading />;

  const hasClosed =
    //@ts-ignore
    market?.hasClosed ||
    //@ts-ignore
    Number(market?.conclusion) * 1000 < new Date().getTime();

  return hasClosed ? (
    //@ts-ignore
    <ClosedMarket market={market} />
  ) : (
    <Market />
  );
};

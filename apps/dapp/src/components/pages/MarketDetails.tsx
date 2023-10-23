import { useParams } from "react-router-dom";
import { useMarkets } from "context/market-context";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Loading } from "ui";
import { ClosedMarket, PastMarket } from "components/organisms/ClosedMarket";
import { Market } from "components/organisms/Market";

export const MarketDetails = () => {
  const { id, chainId } = useParams();

  const { allMarkets: markets, closedMarkets } = useMarkets();

  const allMarkets = [...markets, ...closedMarkets];

  const market: CalculatedMarket | PastMarket = allMarkets.find(
    ({ marketId, chainId: marketChainId }) =>
      marketId == id && marketChainId === chainId
  )!;

  if (!market) return <Loading />;
  const hasClosed =
    market?.hasClosed ||
    Number(market?.conclusion) < new Date().getTime() * 1000;

  //@ts-ignore TODO: improve
  return hasClosed ? (
    <ClosedMarket market={market} />
  ) : (
    <Market market={market} />
  );
};

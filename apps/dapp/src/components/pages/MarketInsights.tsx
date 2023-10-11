import { useParams } from "react-router-dom";
import { useMarkets } from "context/market-context";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Loading } from "ui";
import { ClosedMarket } from "components/organisms/ClosedMarket";
import { Market } from "components/organisms/Market";

export const MarketInsights = () => {
  const { id, chainId } = useParams();

  //TODO: improve
  const { allMarkets: markets, closedMarkets } = useMarkets();
  const allMarkets = [...markets, ...closedMarkets];
  const market: CalculatedMarket = allMarkets.find(
    ({ marketId, chainId: marketChainId }) =>
      marketId == id && marketChainId === chainId
  )!;

  if (!market) return <Loading />;

  if (market?.hasClosed) {
    return <ClosedMarket market={market} />;
  }

  return <Market market={market} />;
};

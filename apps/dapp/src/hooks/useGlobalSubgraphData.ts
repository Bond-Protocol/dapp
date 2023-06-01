import {
  Market,
  PurchaseCount,
  Token,
  UniqueTokenBonderCount,
  useGetGlobalMetricsQuery,
} from "src/generated/graphql";
import { getSubgraphQueries } from "services";
import { useEffect, useState } from "react";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useTestnetMode } from "hooks/useTestnet";

export const useGlobalSubgraphData = () => {
  const globalMetrics = getSubgraphQueries(useGetGlobalMetricsQuery);
  const { isLoading } = useSubgraphLoadingCheck(globalMetrics);

  const [isTestnet] = useTestnetMode();
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [uniqueBonders, setUniqueBonders] = useState(0);
  const [subgraphTokens, setSubgraphTokens] = useState<Token[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [openMarketsByToken, setOpenMarketsByToken] = useState<
    Map<Token, Market[]>
  >(new Map());
  const [closedMarketsByToken, setClosedMarketsByToken] = useState<
    Map<Token, Market[]>
  >(new Map());
  const [futureMarketsByToken, setFutureMarketsByToken] = useState<
    Map<Token, Market[]>
  >(new Map());

  useEffect(() => {
    if (isLoading) return;
    const purchaseCounts = concatSubgraphQueryResultArrays(
      globalMetrics,
      "purchaseCounts"
    );
    const uniqueTokenBonderCounts = concatSubgraphQueryResultArrays(
      globalMetrics,
      "uniqueTokenBonderCounts"
    );
    const tokens = concatSubgraphQueryResultArrays(globalMetrics, "tokens");

    let totalPurchases = 0;
    purchaseCounts.forEach(
      (pc: PurchaseCount) => (totalPurchases += Number(pc["count"]))
    );
    setTotalPurchases(totalPurchases);

    let uniqueBonders = 0;
    uniqueTokenBonderCounts.forEach(
      (ub: UniqueTokenBonderCount) => (uniqueBonders += Number(ub["count"]))
    );
    setUniqueBonders(uniqueBonders);

    const markets: Market[] = [];
    const openMarketsByToken: Map<Token, Market[]> = new Map<Token, Market[]>();
    const closedMarketsByToken: Map<Token, Market[]> = new Map<
      Token,
      Market[]
    >();
    const futureMarketsByToken: Map<Token, Market[]> = new Map<
      Token,
      Market[]
    >();
    tokens.forEach((token: Token) => {
      token.markets?.forEach((market: Market) => {
        if (
          !market.hasClosed &&
          Number(market.conclusion) * 1000 > Date.now()
        ) {
          // Checks if the market start date is in the future
          const willOpenInTheFuture =
            market.start && Number(market.start) * 1000 > Date.now();

          if (willOpenInTheFuture) {
            const futureMarkets = futureMarketsByToken.get(token) || [];
            futureMarkets.push(market);
            futureMarketsByToken.set(token, futureMarkets);
          } else {
            markets.push(market);
            const openMarkets = openMarketsByToken.get(token) || [];
            openMarkets.push(market);
            openMarketsByToken.set(token, openMarkets);
          }
        } else {
          const closedMarkets = closedMarketsByToken.get(token) || [];
          closedMarkets.push(market);
          closedMarketsByToken.set(token, closedMarkets);
        }
      });
    });
    setSubgraphTokens(tokens);
    setMarkets(markets);
    setOpenMarketsByToken(openMarketsByToken);
    setClosedMarketsByToken(closedMarketsByToken);
    setFutureMarketsByToken(futureMarketsByToken);
  }, [isLoading, isTestnet]);

  return {
    totalPurchases: totalPurchases,
    uniqueBonders: uniqueBonders,
    subgraphTokens: subgraphTokens,
    markets: markets,
    openMarketsByToken: openMarketsByToken,
    closedMarketsByToken: closedMarketsByToken,
    futureMarketsByToken: futureMarketsByToken,
    isLoading: !(
      totalPurchases > 0 &&
      uniqueBonders > 0 &&
      subgraphTokens.length > 0 &&
      markets.length > 0
    ),
  };
};

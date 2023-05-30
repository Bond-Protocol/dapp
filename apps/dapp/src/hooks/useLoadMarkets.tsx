import { getSubgraphQueries } from "services/subgraph-endpoints";
import { Market, useListMarketsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export function useLoadMarkets() {
  const subgraphQueries = getSubgraphQueries(useListMarketsQuery, "addresses");
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());

  useEffect(() => {
    if (isLoading) return;
    setMarkets(concatSubgraphQueryResultArrays(subgraphQueries, "markets"));
  }, [isLoading, isTestnet]);

  useEffect(() => {
    const map: Map<string, Market> = new Map();
    markets.forEach((market) => {
      map.set(market.id, market);
    });

    setMarketsMap(map);
  }, [markets]);

  return {
    markets: markets,
    marketsMap: marketsMap,
    isLoading,
  };
}

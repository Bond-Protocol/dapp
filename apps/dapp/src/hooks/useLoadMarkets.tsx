import { getSubgraphQueriesPerChainFn, useSubgraphForChain } from "services";
import { Market, useListMarketsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { getAddressesByChain } from "@bond-protocol/bond-library";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { environment } from "src/environment";

const isTestnet = environment.isTestnet;

export function useLoadMarkets() {
  const { queries: subgraphQueries, isLoading } = useSubgraphForChain(
    useListMarketsQuery,
    getAddressesByChain,
    "addresses"
  );

  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());

  useEffect(() => {
    if (isLoading) return;
    setMarkets(concatSubgraphQueryResultArrays(subgraphQueries, "markets"));
  }, [isLoading, isTestnet]);

  useEffect(() => {
    if (markets.length && !marketsMap.size) {
      const map: Map<string, Market> = new Map();
      markets.forEach((market) => {
        map.set(market.id, market);
      });
      setMarketsMap(map);
    }
  }, [markets]);

  return {
    markets: markets,
    marketsMap: marketsMap,
    isLoading,
  };
}

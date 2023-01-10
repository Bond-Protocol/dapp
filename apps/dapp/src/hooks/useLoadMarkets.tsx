import { getSubgraphQueriesPerChainFn } from "services/subgraph-endpoints";
import { Market, useListMarketsQuery } from "../generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { getAddressesByChain } from "@bond-protocol/bond-library";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export function useLoadMarkets() {
  const subgraphQueries = getSubgraphQueriesPerChainFn(
    useListMarketsQuery,
    getAddressesByChain,
    "addresses"
  );

  const [isTestnet] = useAtom(testnetMode);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());

  const isLoading = useMemo(() => {
    return (
      subgraphQueries.length > 0 &&
      subgraphQueries
        .map((value) => value.isLoading)
        .reduce((previous, current) => previous || current)
    );
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setMarkets(
      subgraphQueries
        .map((value) => value.data.markets)
        .reduce((previous, current) => previous.concat(current))
    );
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

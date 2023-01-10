import {getSubgraphQueriesPerChainFn} from "services/subgraph-endpoints";
import {Market, useListMarketsQuery} from "../generated/graphql";
import {useEffect, useMemo, useState} from "react";
import {getAddressesByChain} from "@bond-protocol/bond-library";

export function useLoadMarkets() {
  const subgraphQueries = getSubgraphQueriesPerChainFn(useListMarketsQuery, getAddressesByChain, "addresses");

  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map(value => value.isLoading)
      .reduce((previous, current) => previous || current)
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setMarkets(
      subgraphQueries
        .map(value => value.data.markets)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading]);

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

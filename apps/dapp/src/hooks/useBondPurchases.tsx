import {getSubgraphQueriesPerChainFn} from "services/subgraph-endpoints";
import {useEffect, useMemo, useState} from "react";
import {BondPurchase, useListBondPurchasesQuery} from "../generated/graphql";
import {getAddressesByChain} from "@bond-protocol/bond-library";

export function useBondPurchases() {
  const subgraphQueries = getSubgraphQueriesPerChainFn(useListBondPurchasesQuery, getAddressesByChain, "addresses");

  const [bondPurchases, setBondPurchases] = useState<BondPurchase[]>([]);
  const [bondPurchasesByMarket, setBondPurchasesByMarket] = useState<Map<string, BondPurchase[]>>(new Map());

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map(value => value.isLoading)
      .reduce((previous, current) => previous || current)
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setBondPurchases(
      subgraphQueries
        .map(value => value.data.bondPurchases)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading]);

  useEffect(() => {
    const bondPurchasesByMarketMap: Map<string, BondPurchase[]> = new Map();

    bondPurchases.forEach((bondPurchase) => {
      const array = bondPurchasesByMarketMap.get(bondPurchase.marketId) || [];
      array.push(bondPurchase);
      bondPurchasesByMarketMap.set(bondPurchase.marketId, array);
    });

    setBondPurchasesByMarket(bondPurchasesByMarketMap);
  }, [bondPurchases]);

  return {
    bondPurchases: bondPurchases,
    purchasesByMarket: bondPurchasesByMarket,
    isLoading,
  };
}

import { getSubgraphQueriesPerChainFn } from "services/subgraph-endpoints";
import { useEffect, useState } from "react";
import { BondPurchase, useListBondPurchasesQuery } from "../generated/graphql";
import { getAddressesByChain } from "@bond-protocol/bond-library";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export function useBondPurchases() {
  const subgraphQueries = getSubgraphQueriesPerChainFn(
    useListBondPurchasesQuery,
    getAddressesByChain,
    "addresses"
  );
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [bondPurchases, setBondPurchases] = useState<BondPurchase[]>([]);
  const [bondPurchasesByMarket, setBondPurchasesByMarket] = useState<
    Map<string, BondPurchase[]>
  >(new Map());

  useEffect(() => {
    if (isLoading) return;
    setBondPurchases(
      concatSubgraphQueryResultArrays(subgraphQueries, "bondPurchases")
    );
  }, [isLoading, isTestnet]);

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

import { useState, useEffect, useMemo } from "react";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";

export const useListAllPurchases = () => {
  const subgraphQueries = getSubgraphQueries(useListAllPurchasesQuery);

  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map((value) => value.isLoading)
      .reduce((previous, current) => previous || current);
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setAllPurchases(
      subgraphQueries
        .map((value) => value.data.bondPurchases)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading]);

  return {
    allPurchases: allPurchases,
    totalPurchases: allPurchases.length,
  };
};

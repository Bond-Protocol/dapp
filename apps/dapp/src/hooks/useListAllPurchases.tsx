import { useState, useEffect, useMemo } from "react";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useListAllPurchases = () => {
  const subgraphQueries = getSubgraphQueries(useListAllPurchasesQuery);

  const [isTestnet] = useAtom(testnetMode);
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
  }, [isLoading, isTestnet]);

  return {
    allPurchases: allPurchases,
    totalPurchases: allPurchases.length,
  };
};

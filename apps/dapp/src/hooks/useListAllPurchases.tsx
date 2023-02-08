import { useEffect, useState } from "react";
import { getSubgraphQueries } from "services";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { environment } from "src/environment";

const isTestnet = environment.isTestnet;

export const useListAllPurchases = () => {
  const subgraphQueries = getSubgraphQueries(useListAllPurchasesQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);

  useEffect(() => {
    if (isLoading || allPurchases.length) return;
    setAllPurchases(
      concatSubgraphQueryResultArrays(subgraphQueries, "bondPurchases")
    );
  }, [isLoading, isTestnet]);

  return {
    allPurchases: allPurchases,
    totalPurchases: allPurchases.length,
  };
};

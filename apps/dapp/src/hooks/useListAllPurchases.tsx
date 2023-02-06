import { useEffect, useState } from "react";
import { getSubgraphQueries } from "services";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export const useListAllPurchases = () => {
  const subgraphQueries = getSubgraphQueries(useListAllPurchasesQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);

  useEffect(() => {
    if (isLoading) return;
    setAllPurchases(
      concatSubgraphQueryResultArrays(subgraphQueries, "bondPurchases")
    );
  }, [isLoading, isTestnet]);

  return {
    allPurchases: allPurchases,
    totalPurchases: allPurchases.length,
  };
};

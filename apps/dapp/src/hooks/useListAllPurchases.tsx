import { useEffect, useState } from "react";
import { getSubgraphQueries } from "services";
import {BondPurchase, PurchaseCount, useGetPurchaseCountQuery, useListAllPurchasesQuery} from "src/generated/graphql";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { environment } from "src/environment";

const isTestnet = environment.isTestnet;

export const useListAllPurchases = () => {
  const subgraphQueries = getSubgraphQueries(useListAllPurchasesQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const totalPurchaseQueries = getSubgraphQueries(useGetPurchaseCountQuery);
  const { isLoading: isLoadingTotal } = useSubgraphLoadingCheck(totalPurchaseQueries);

  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  useEffect(() => {
    if (isLoading || allPurchases.length) return;
    setAllPurchases(
      concatSubgraphQueryResultArrays(subgraphQueries, "bondPurchases")
    );
  }, [isLoading, isTestnet]);

  useEffect(() => {
    if (isLoadingTotal) return;
    const purchaseCounts = concatSubgraphQueryResultArrays(totalPurchaseQueries, "purchaseCounts");
    let total = 0;
    purchaseCounts.forEach((pc: PurchaseCount) => total += Number(pc["count"]));
    setTotalPurchases(total);
  }, [isLoadingTotal, isTestnet]);

  return {
    allPurchases: allPurchases,
    totalPurchases: totalPurchases,
  };
};

import {
  Market,
  PurchaseCount,
  Token,
  UniqueTokenBonderCount,
  useGetGlobalDataQuery,
} from "src/generated/graphql";
import { getSubgraphQueries } from "services";
import { useEffect, useState } from "react";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useTestnetMode } from "hooks/useTestnet";

const currentTime = Math.trunc(Date.now() / 1000);

export const useSubgraphLoader = () => {
  const globalMetrics = getSubgraphQueries(useGetGlobalDataQuery, {
    currentTime: currentTime,
  });
  const { isLoading } = useSubgraphLoadingCheck(globalMetrics);

  const [isTestnet] = useTestnetMode();
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [uniqueBonders, setUniqueBonders] = useState(0);
  const [subgraphTokens, setSubgraphTokens] = useState<Token[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isCurrentLoading, setIsCurrentLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    const purchaseCounts = concatSubgraphQueryResultArrays(
      globalMetrics,
      "purchaseCounts"
    );
    const uniqueTokenBonderCounts = concatSubgraphQueryResultArrays(
      globalMetrics,
      "uniqueTokenBonderCounts"
    );
    const tokens = concatSubgraphQueryResultArrays(globalMetrics, "tokens");

    let totalPurchases = 0;
    purchaseCounts.forEach(
      (pc: PurchaseCount) => (totalPurchases += Number(pc["count"]))
    );
    setTotalPurchases(totalPurchases);

    let uniqueBonders = 0;
    uniqueTokenBonderCounts.forEach(
      (ub: UniqueTokenBonderCount) => (uniqueBonders += Number(ub["count"]))
    );
    setUniqueBonders(uniqueBonders);

    let markets: Market[] = [];
    // @ts-ignore
    tokens.forEach((token: Token) => (markets = markets.concat(token.markets)));

    setSubgraphTokens(tokens);
    setMarkets(markets);
    setIsCurrentLoading(false);
  }, [isLoading, isTestnet]);

  return {
    totalPurchases: totalPurchases,
    uniqueBonders: uniqueBonders,
    subgraphTokens: subgraphTokens,
    markets: markets,
    isLoading: isCurrentLoading,
    // totalPurchases > 0 &&
    // uniqueBonders > 0 &&
    // subgraphTokens.length > 0 &&
    // markets.length > 0
  };
};

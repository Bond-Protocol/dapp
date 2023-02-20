import { getSubgraphQueries } from "services";
import { Market, useListOwnedMarketsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

const returnBullshit = () => {
  return {
    markets: [],
    isLoading: false,
  };
};

export function useMyMarkets() {
  //## DEBUGGING
  returnBullshit();

  const { address } = useAccount();

  const subgraphQueries = getSubgraphQueries(useListOwnedMarketsQuery, {
    owner: address,
  });

  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [myMarkets, setMyMarkets] = useState<Market[]>([]);

  useEffect(() => {
    if (isLoading) return;
    setMyMarkets(concatSubgraphQueryResultArrays(subgraphQueries, "markets"));
  }, [isLoading, isTestnet]);

  return {
    markets: myMarkets,
    isLoading,
  };
}

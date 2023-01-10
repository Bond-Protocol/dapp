import { getSubgraphQueries } from "services/subgraph-endpoints";
import { Market, useListOwnedMarketsQuery } from "../generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export function useMyMarkets() {
  const { address } = useAccount();
  const subgraphQueries = getSubgraphQueries(useListOwnedMarketsQuery, {
    owner: address,
  });

  const [isTestnet] = useAtom(testnetMode);
  const [myMarkets, setMyMarkets] = useState<Market[]>([]);

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map((value) => value.isLoading)
      .reduce((previous, current) => previous || current);
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setMyMarkets(
      subgraphQueries
        .map((value) => value.data.markets)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading, isTestnet]);

  return {
    markets: myMarkets,
    isLoading,
  };
}

import { getSubgraphQueries } from "services/subgraph-endpoints";
import { Market, useListOwnedMarketsQuery } from "../generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export function useMyMarkets() {
  const { address } = useAccount();
  const subgraphQueries = getSubgraphQueries(useListOwnedMarketsQuery, {
    owner: address,
  });

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
  }, [isLoading]);

  return {
    markets: myMarkets,
    isLoading,
  };
}

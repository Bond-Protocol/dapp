import { useListUniqueBondersQuery } from "src/generated/graphql";
import { getSubgraphQueries } from "services";
import { useEffect, useState } from "react";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { useTestnetMode } from "hooks/useTestnet";

export const useGlobalMetrics = () => {
  const subgraphQueries = getSubgraphQueries(useListUniqueBondersQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useTestnetMode();
  const [uniqueBonders, setUniqueBonders] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    setUniqueBonders(
      subgraphQueries
        .map((value) => value.data?.uniqueBonders.length || 0)
        .reduce((previous, current) => previous + current)
    );
  }, [isLoading, isTestnet]);

  return {
    uniqueBonders,
  };
};

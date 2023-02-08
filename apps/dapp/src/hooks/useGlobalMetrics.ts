import { useListUniqueBondersQuery } from "src/generated/graphql";
import { getSubgraphQueries } from "services";
import { useOwnerTokenTbvs } from "./useOwnerTokenTbvs";
import { usdFormatter } from "src/utils/format";
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
        .map((value) => value.data.uniqueBonders.length)
        .reduce((previous, current) => previous + current)
    );
  }, [isLoading, isTestnet]);

  const { protocolTbvs } = useOwnerTokenTbvs();
  const tbv = Object.values(protocolTbvs).reduce(
    (total, { tbv }) => total + tbv,
    0
  );

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    protocolTbvs,
    uniqueBonders,
  };
};

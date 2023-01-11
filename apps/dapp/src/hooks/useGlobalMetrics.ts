import { useListUniqueBondersQuery } from "src/generated/graphql";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { useOwnerTokenTbvs } from "./useOwnerTokenTbvs";
import { usdFormatter } from "src/utils/format";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export const useGlobalMetrics = () => {
  const subgraphQueries = getSubgraphQueries(useListUniqueBondersQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [uniqueBonders, setUniqueBonders] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    let bonders = 0;
    subgraphQueries.forEach((result) => {
      if (result.data) bonders += result.data.uniqueBonders.length;
    });

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
    protocolTbvs: protocolTbvs,
    uniqueBonders: uniqueBonders,
  };
};

import { useListUniqueBondersQuery } from "src/generated/graphql";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { useOwnerTokenTbvs } from "./useOwnerTokenTbvs";
import { usdFormatter } from "src/utils/format";
import { useEffect, useMemo, useState } from "react";

export const useGlobalMetrics = () => {
  const subgraphQueries = getSubgraphQueries(useListUniqueBondersQuery);

  const [uniqueBonders, setUniqueBonders] = useState(0);

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map((value) => value.isLoading)
      .reduce((previous, current) => previous || current);
  }, [subgraphQueries]);

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
  }, [isLoading]);

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

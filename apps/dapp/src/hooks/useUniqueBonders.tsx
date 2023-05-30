import { getSubgraphQueries } from "services";
import { useEffect, useState } from "react";
import { UniqueBonder, useListUniqueBondersQuery } from "../generated/graphql";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export function useUniqueBonders() {
  const subgraphQueries = getSubgraphQueries(useListUniqueBondersQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [bonders, setBonders] = useState(new Map<string, number>());

  useEffect(() => {
    if (isLoading) return;
    const allBonders = concatSubgraphQueryResultArrays(
      subgraphQueries,
      "uniqueBonders"
    );

    const bonderMap = new Map();

    allBonders.forEach((bonder: UniqueBonder) => {
      const split = bonder.id.split("__");
      const current = bonderMap.get(split[0]);
      if (current) {
        bonderMap.set(split[0], current + 1);
      } else {
        bonderMap.set(split[0], 1);
      }
    });

    setBonders(bonderMap);
  }, [isLoading]);

  return {
    bonders: bonders,
    isLoading,
  };
}

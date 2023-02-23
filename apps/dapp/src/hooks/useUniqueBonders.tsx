import { getSubgraphQueries } from "services";
import { useEffect, useState } from "react";
import { UniqueBonder, useListUniqueBondersQuery } from "../generated/graphql";
import { getAddressesByProtocol } from "@bond-protocol/bond-library";
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

  function getBondersForProtocol(name: string): number {
    const addresses = getAddressesByProtocol(name);
    let count = 0;

    addresses.forEach((address) => {
      const id = (address.chainId + "_" + address.address).toLowerCase();
      const bondersForAddress = bonders.get(id);
      if (bondersForAddress) count = count + bondersForAddress;
    });

    return count;
  }

  return {
    bonders: bonders,
    getBondersForProtocol: (name: string) => getBondersForProtocol(name),
    isLoading,
  };
}

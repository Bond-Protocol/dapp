import {getSubgraphQueries, subgraphEndpoints} from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useMemo, useState} from "react";
import {UniqueBonder, useListOwnerTokenTbvsQuery, useListUniqueBondersQuery} from "../generated/graphql";
import { getAddressesByProtocol, CHAIN_ID } from "@bond-protocol/bond-library";

export function useUniqueBonders() {
  const subgraphQueries = getSubgraphQueries(useListUniqueBondersQuery);

  const [bonders, setBonders] = useState(new Map<string, number>());

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map(value => value.isLoading)
      .reduce((previous, current) => previous || current)
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    const allBonders = subgraphQueries
      .map(value => value.data.uniqueBonders)
      .reduce((previous, current) => previous.concat(current));

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

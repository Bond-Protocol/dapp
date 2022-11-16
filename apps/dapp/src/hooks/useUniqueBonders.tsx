import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  useListUniqueBondersGoerliQuery,
  useListUniqueBondersMainnetQuery,
} from "../generated/graphql";
import { getAddressesByProtocol } from "@bond-protocol/bond-library";

export function useUniqueBonders() {
  const endpoints = getSubgraphEndpoints();
  const [testnet, setTestnet] = useAtom(testnetMode);

  const [selectedBonders, setSelectedBonders] = useState(
    new Map<string, number>()
  );
  const [mainnetBonders, setMainnetBonders] = useState(
    new Map<string, number>()
  );
  const [testnetBonders, setTestnetBonders] = useState(
    new Map<string, number>()
  );

  const { data: mainnetData } = useListUniqueBondersMainnetQuery({
    endpoint: endpoints[0],
  });

  const { data: goerliData } = useListUniqueBondersGoerliQuery({
    endpoint: endpoints[1],
  });

  useEffect(() => {
    if (mainnetData && mainnetData.uniqueBonders) {
      const allBonders = mainnetData.uniqueBonders;
      const bonderMap = new Map();

      allBonders.forEach((bonder) => {
        const split = bonder.id.split("__");
        const current = bonderMap.get(split[0]);
        if (current) {
          bonderMap.set(split[0], current + 1);
        } else {
          bonderMap.set(split[0], 1);
        }
      });

      setMainnetBonders(bonderMap);
    }
  }, [mainnetData]);

  useEffect(() => {
    if (goerliData && goerliData.uniqueBonders) {
      const allBonders = goerliData.uniqueBonders;
      const bonderMap = new Map();

      allBonders.forEach((bonder) => {
        const split = bonder.id.split("__");
        const current = bonderMap.get(split[0]);
        if (current) {
          bonderMap.set(split[0], current + 1);
        } else {
          bonderMap.set(split[0], 1);
        }
      });

      setTestnetBonders(bonderMap);
    }
  }, [goerliData]);

  useEffect(() => {
    if (testnet) {
      setSelectedBonders(testnetBonders);
    } else {
      setSelectedBonders(mainnetBonders);
    }
  }, [testnet, mainnetBonders, testnetBonders]);

  function getBondersForProtocol(name: string): number {
    const addresses = getAddressesByProtocol(name);
    let count = 0;

    addresses.forEach((address) => {
      const id = (address.chainId + "_" + address.address).toLowerCase();
      const bonders = selectedBonders.get(id);
      if (bonders) count = count + bonders;
    });

    return count;
  }

  return {
    bonders: selectedBonders,
    getBondersForProtocol: (name: string) => getBondersForProtocol(name),
  };
}

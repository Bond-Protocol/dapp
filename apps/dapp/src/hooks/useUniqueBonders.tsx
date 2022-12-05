import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  useListUniqueBondersArbitrumGoerliQuery,
  useListUniqueBondersArbitrumMainnetQuery,
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

  const { data: mainnetData, ...mainnetQuery } = useListUniqueBondersMainnetQuery({
    endpoint: endpoints[0],
  });

  const { data: goerliData, ...goerliQuery } = useListUniqueBondersGoerliQuery({
    endpoint: endpoints[1],
  });

  const { data: arbitrumMainnetData, ...arbitrumMainnetQuery } = useListUniqueBondersArbitrumMainnetQuery({
    endpoint: endpoints[2],
  });

  const { data: arbitrumGoerliData, ...arbitrumGoerliQuery } = useListUniqueBondersArbitrumGoerliQuery({
    endpoint: endpoints[3],
  });

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.uniqueBonders && arbitrumMainnetData && arbitrumMainnetData.uniqueBonders) {
      const allBonders =
        mainnetData.uniqueBonders
          .concat(arbitrumMainnetData.uniqueBonders);
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
  }, [mainnetData, arbitrumMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.uniqueBonders && arbitrumGoerliData && arbitrumGoerliData.uniqueBonders) {
      const allBonders =
        goerliData.uniqueBonders
          .concat(arbitrumGoerliData.uniqueBonders);
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
  }, [goerliData, arbitrumGoerliData, testnet]);

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

  const isLoading = testnet
    ? (goerliQuery.isLoading || arbitrumGoerliQuery.isLoading)
    : (mainnetQuery.isLoading || arbitrumMainnetQuery.isLoading);

  return {
    bonders: selectedBonders,
    getBondersForProtocol: (name: string) => getBondersForProtocol(name),
    isLoading,
  };
}

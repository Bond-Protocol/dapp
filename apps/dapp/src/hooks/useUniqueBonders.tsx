import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import { useListUniqueBondersQuery } from "../generated/graphql";
import { getAddressesByProtocol, CHAIN_ID } from "@bond-protocol/bond-library";

export function useUniqueBonders() {
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

  const { data: ethMainnetData, ...ethMainnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-unique-bonders" },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-unique-bonders" },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-unique-bonders" },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-unique-bonders" },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (
      ethMainnetData &&
      ethMainnetData.uniqueBonders &&
      arbMainnetData &&
      arbMainnetData.uniqueBonders
    ) {
      const allBonders = ethMainnetData.uniqueBonders.concat(
        arbMainnetData.uniqueBonders
      );
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
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (
      ethTestnetData &&
      ethTestnetData.uniqueBonders &&
      arbTestnetData &&
      arbTestnetData.uniqueBonders
    ) {
      const allBonders = ethTestnetData.uniqueBonders.concat(
        arbTestnetData.uniqueBonders
      );
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
  }, [ethTestnetData, arbTestnetData, testnet]);

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
    ? ethTestnetQuery.isLoading || arbTestnetQuery.isLoading
    : ethMainnetQuery.isLoading || arbMainnetQuery.isLoading;

  return {
    bonders: selectedBonders,
    getBondersForProtocol: (name: string) => getBondersForProtocol(name),
    isLoading,
  };
}

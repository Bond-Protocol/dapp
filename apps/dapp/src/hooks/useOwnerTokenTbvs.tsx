import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useTokens } from "hooks/useTokens";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { OwnerTokenTbv, useListOwnerTokenTbvsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { getProtocolByAddress, CHAIN_ID } from "@bond-protocol/bond-library";

export function useOwnerTokenTbvs() {
  const { getPrice, currentPrices } = useTokens();
  const [testnet] = useAtom(testnetMode);

  const [protocolTbvs, setProtocolTbvs] = useState<Record<string, any>>([]);
  const [mainnetOwnerTokenTbvs, setMainnetOwnerTokenTbvs] = useState<
    OwnerTokenTbv[]
    >([]);
  const [testnetOwnerTokenTbvs, setTestnetOwnerTokenTbvs] = useState<
    OwnerTokenTbv[]
    >([]);

  const { data: ethMainnetData, ...ethMainnetQuery } = useListOwnerTokenTbvsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-owner-token-tbvs" },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListOwnerTokenTbvsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-owner-token-tbvs" },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListOwnerTokenTbvsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-owner-token-tbvs" },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListOwnerTokenTbvsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-owner-token-tbvs" },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (
      ethMainnetData &&
      ethMainnetData.ownerTokenTbvs &&
      arbMainnetData &&
      arbMainnetData.ownerTokenTbvs
    ) {
      const allOwnerTokens = ethMainnetData.ownerTokenTbvs.concat(
        arbMainnetData.ownerTokenTbvs
      );
      // @ts-ignore
      setMainnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (
      ethTestnetData &&
      ethTestnetData.ownerTokenTbvs &&
      arbTestnetData &&
      arbTestnetData.ownerTokenTbvs
    ) {
      const allOwnerTokens = ethTestnetData.ownerTokenTbvs.concat(
        arbTestnetData.ownerTokenTbvs
      );
      // @ts-ignore
      setTestnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

  useEffect(() => {
    let selected = testnet ? testnetOwnerTokenTbvs : mainnetOwnerTokenTbvs;

    const updated = selected
      .map((token) => {
        const protocol = getProtocolByAddress(token.owner, token.chainId);
        if (!protocol) return { id: "", tbv: 0 };

        const price = getPrice(token?.token);
        let value = 0 + parseFloat(token?.tbv) * price;
        let tbv = isNaN(value) ? 0 : value;
        return { id: protocol?.id, tbv };
      })
      .reduce(
        (elements: Record<string, { id: string; tbv: number }>, current) => {
          const tbv = elements[current.id]?.tbv || 0;
          return {
            ...elements,
            [current.id]: {
              id: current.id,
              tbv: isNaN(tbv) ? current.tbv : current.tbv + tbv,
            },
          };
        },
        {}
      );

    //@ts-ignore
    setProtocolTbvs(updated);
  }, [testnet, mainnetOwnerTokenTbvs, testnetOwnerTokenTbvs, currentPrices]);

  const isLoading = testnet
    ? ethTestnetQuery.isLoading || arbTestnetQuery.isLoading
    : ethMainnetQuery.isLoading || arbMainnetQuery.isLoading;

  return {
    isLoading,
    protocolTbvs,
  };
}

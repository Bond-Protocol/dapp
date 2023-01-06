import { subgraphEndpoints } from "services/subgraph-endpoints";
import { Market, useListOwnedMarketsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useAccount } from "wagmi";
import { CHAIN_ID } from "@bond-protocol/bond-library";

export function useMyMarkets() {
  const { address } = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: ethMainnetData, ...ethMainnetQuery } = useListOwnedMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    {
      owner: address || "0x0000000000000000",
      queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-owned-markets"
    },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListOwnedMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    {
      owner: address || "0x0000000000000000",
      queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-owned-markets"
    },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListOwnedMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    {
      owner: address || "0x0000000000000000",
      queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-owned-markets"
    },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListOwnedMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    {
      owner: address || "0x0000000000000000",
      queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-owned-markets"
    },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (ethMainnetData && ethMainnetData.markets && arbMainnetData && arbMainnetData.markets) {
      const allMarkets =
        ethMainnetData.markets
          .concat(arbMainnetData.markets);
      // @ts-ignore
      setMainnetMarkets(allMarkets);
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetData && ethTestnetData.markets && arbTestnetData && arbTestnetData.markets) {
      const allMarkets =
        ethTestnetData.markets
          .concat(arbTestnetData.markets);
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedMarkets(testnetMarkets);
    } else {
      setSelectedMarkets(mainnetMarkets);
    }
  }, [testnet, mainnetMarkets, testnetMarkets]);

  const isLoading = testnet
    ? (ethTestnetQuery.isLoading || arbTestnetQuery.isLoading)
    : (ethMainnetQuery.isLoading || arbMainnetQuery.isLoading);

  return {
    markets: selectedMarkets,
    isLoading,
  };
}

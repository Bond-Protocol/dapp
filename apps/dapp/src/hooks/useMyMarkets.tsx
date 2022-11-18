import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {
  Market,
  useListOwnedMarketsGoerliQuery,
  useListOwnedMarketsMainnetQuery,
} from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useAccount } from "wagmi";

export function useMyMarkets() {
  const endpoints = getSubgraphEndpoints();

  const { address } = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: mainnetData, ...mainnetQuery } =
    useListOwnedMarketsMainnetQuery(
      { endpoint: endpoints[0] },
      { owner: address || "0x0000000000000000" },
      { enabled: !testnet }
    );

  const { data: goerliData, ...testnetQuery } = useListOwnedMarketsGoerliQuery(
    { endpoint: endpoints[1] },
    { owner: address || "0x0000000000000000" },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.markets) {
      const allMarkets = mainnetData.markets;
      // @ts-ignore
      setMainnetMarkets(allMarkets);
    }
  }, [mainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.markets) {
      const allMarkets = goerliData.markets;
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [goerliData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedMarkets(testnetMarkets);
    } else {
      setSelectedMarkets(mainnetMarkets);
    }
  }, [testnet, mainnetMarkets, testnetMarkets]);

  const isLoading = testnet ? testnetQuery.isLoading : mainnetQuery.isLoading;

  return {
    markets: selectedMarkets,
    isLoading,
  };
}

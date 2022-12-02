import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {
  Market,
  useListMarketsGoerliQuery,
  useListMarketsMainnetQuery,
  useListMarketsArbitrumGoerliQuery,
  useListMarketsArbitrumMainnetQuery
} from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { CHAIN_ID, getAddressesByChain } from "@bond-protocol/bond-library";

export function useLoadMarkets() {
  const endpoints = getSubgraphEndpoints();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: mainnetData, ...mainnetQuery } = useListMarketsMainnetQuery(
    { endpoint: endpoints[0] },
    { addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET) },
    { enabled: !testnet }
  );

  const { data: goerliData, ...goerliQuery } = useListMarketsGoerliQuery(
    { endpoint: endpoints[1] },
    { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) },
    { enabled: !!testnet }
  );

  const { data: arbitrumMainnetData, ...arbitrumMainnetQuery } = useListMarketsArbitrumMainnetQuery(
    { endpoint: endpoints[2] },
    { addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_MAINNET) },
    { enabled: !testnet }
  );

  const { data: arbitrumGoerliData, ...arbitrumGoerliQuery } = useListMarketsArbitrumGoerliQuery(
    { endpoint: endpoints[3] },
    { addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_GOERLI_TESTNET) },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.markets && arbitrumMainnetData && arbitrumMainnetData.markets) {
      const allMarkets =
        mainnetData.markets
          .concat(arbitrumMainnetData.markets);
      // @ts-ignore
      setMainnetMarkets(allMarkets);
    }
  }, [mainnetData, arbitrumMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.markets && arbitrumGoerliData && arbitrumGoerliData.markets) {
      const allMarkets = goerliData.markets
        .concat(arbitrumGoerliData.markets);
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [goerliData, arbitrumGoerliData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedMarkets(testnetMarkets);
    } else {
      setSelectedMarkets(mainnetMarkets);
    }
  }, [testnet, mainnetMarkets, testnetMarkets]);

  useEffect(() => {
    const map: Map<string, Market> = new Map();
    selectedMarkets.forEach((market) => {
      map.set(market.id, market);
    });
    setMarketsMap(map);
  }, [selectedMarkets]);

  const isLoading = testnet
    ? (goerliQuery.isLoading || arbitrumGoerliQuery.isLoading)
    : (mainnetQuery.isLoading || arbitrumMainnetQuery.isLoading);

  return {
    markets: selectedMarkets,
    marketsMap: marketsMap,
    isLoading,
  };
}

import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {
  Market,
  useListMarketsGoerliQuery,
  useListMarketsMainnetQuery,
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

  const { data: mainnetData, ...mainetQuery } = useListMarketsMainnetQuery(
    { endpoint: endpoints[0] },
    { addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET) },
    { enabled: !testnet }
  );

  const { data: goerliData, ...testnetQuery } = useListMarketsGoerliQuery(
    { endpoint: endpoints[1] },
    { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) },
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

  useEffect(() => {
    const map: Map<string, Market> = new Map();
    selectedMarkets.forEach((market) => {
      map.set(market.id, market);
    });
    setMarketsMap(map);
  }, [selectedMarkets]);

  const isLoading = testnet ? testnetQuery.isLoading : mainetQuery.isLoading;

  return {
    markets: selectedMarkets,
    marketsMap: marketsMap,
    isLoading,
  };
}

import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {Market, useListMarketsGoerliQuery, useListMarketsMainnetQuery} from "../generated/graphql";
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

  const { data: mainnetData } = useListMarketsMainnetQuery(
    { endpoint: endpoints[0] },
    { addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET) }
  );
  
  const { data: goerliData } = useListMarketsGoerliQuery(
    { endpoint: endpoints[0] },
    { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) }
  );

  useEffect(() => {
    if (mainnetData && mainnetData.markets) {
      const allMarkets = mainnetData.markets;
      // @ts-ignore
      setMainnetMarkets(allMarkets);
    }
  }, [mainnetData]);

  useEffect(() => {
    if (goerliData && goerliData.markets) {
      const allMarkets = goerliData.markets;
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [goerliData]);

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

  return {
    markets: selectedMarkets,
    marketsMap: marketsMap,
  };
}

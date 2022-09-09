//@ts-nocheck
import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Market, useListMarketsGoerliQuery, useListMarketsRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {CHAIN_ID, getAddressesByChain} from "@bond-labs/bond-library";

export function useMarkets() {
  const endpoints = getSubgraphEndpoints();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: rinkebyData } = useListMarketsRinkebyQuery(
    { endpoint: endpoints[0] },
    { addresses: getAddressesByChain(CHAIN_ID.RINKEBY_TESTNET) }
  );
  const { data: goerliData } = useListMarketsGoerliQuery(
    { endpoint: endpoints[1] },
    { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) }
  );

  useEffect(() => {
    if (
      rinkebyData &&
      rinkebyData.markets &&
      goerliData &&
      goerliData.markets
    ) {
      const allMarkets = rinkebyData.markets.concat(goerliData.markets);
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [rinkebyData, goerliData]);

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

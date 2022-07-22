import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Market, useListMarketsGoerliQuery, useListMarketsRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export function useMarkets() {
  const endpoints = getSubgraphEndpoints();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const {data: rinkebyData} = useListMarketsRinkebyQuery(
    {endpoint: endpoints[0]},
    {},
    {staleTime: 5 * 60 * 1000} // 5 minutes
  );

  const {data: goerliData} = useListMarketsGoerliQuery(
    {endpoint: endpoints[1]},
    {},
    {staleTime: 5 * 60 * 1000} // 5 minutes
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

  return {
    markets: selectedMarkets,
  };
}

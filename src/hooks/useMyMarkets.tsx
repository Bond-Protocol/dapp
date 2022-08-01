import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Market, useListOwnedMarketsGoerliQuery, useListOwnedMarketsRinkebyQuery} from "../generated/graphql";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useAccount} from "wagmi";

export function useMyMarkets() {
  const endpoints = getSubgraphEndpoints();

  const {address} = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const {data: rinkebyData} = useListOwnedMarketsRinkebyQuery(
    {endpoint: endpoints[0]},
    {owner: address || ""}
  );
  const {data: goerliData} = useListOwnedMarketsGoerliQuery(
    {endpoint: endpoints[1]},
    {owner: address || ""}
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

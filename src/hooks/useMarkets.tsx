import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Market, useListMarketsGoerliQuery, useListMarketsRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";

export function useMarkets() {
  const endpoints = getSubgraphEndpoints();

  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: rinkebyData } = useListMarketsRinkebyQuery({
    endpoint: endpoints[0],
  });

  const { data: goerliData } = useListMarketsGoerliQuery({
    endpoint: endpoints[1],
  });

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

  return {
    mainnet: mainnetMarkets,
    testnet: testnetMarkets,
  };
}

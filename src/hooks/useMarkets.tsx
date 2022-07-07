import { getSubgraphEndpoints } from 'services/subgraph-endpoints';
import {
  useListMarketsGoerliQuery,
  useListMarketsRinkebyQuery,
} from '../generated/graphql';
import { useEffect, useState } from 'react';

export function useMarkets() {
  const endpoints = getSubgraphEndpoints();

  const [mainnetMarkets, setMainnetMarkets] = useState<any[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<any[]>([]);

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

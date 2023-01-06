import { subgraphEndpoints } from "services/subgraph-endpoints";
import { Market, useListMarketsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { CHAIN_ID, getAddressesByChain } from "@bond-protocol/bond-library";

export function useLoadMarkets() {
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [marketsMap, setMarketsMap] = useState<Map<string, Market>>(new Map());
  const [mainnetMarkets, setMainnetMarkets] = useState<Market[]>([]);
  const [testnetMarkets, setTestnetMarkets] = useState<Market[]>([]);

  const { data: ethMainnetData, ...ethMainnetQuery } = useListMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET),
      queryKey:CHAIN_ID.ETHEREUM_MAINNET + "-list-markets"
    },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET),
      queryKey:CHAIN_ID.GOERLI_TESTNET + "-list-markets"
    },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_MAINNET),
      queryKey:CHAIN_ID.ARBITRUM_MAINNET + "-list-markets"
    },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListMarketsQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_GOERLI_TESTNET),
      queryKey:CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-markets"
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
      const allMarkets = ethTestnetData.markets
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

  useEffect(() => {
    const map: Map<string, Market> = new Map();
    selectedMarkets.forEach((market) => {
      map.set(market.id, market);
    });
    setMarketsMap(map);
  }, [selectedMarkets]);

  const isLoading = testnet
    ? (ethTestnetQuery.isLoading || arbTestnetQuery.isLoading)
    : (ethMainnetQuery.isLoading || arbMainnetQuery.isLoading);

  return {
    markets: selectedMarkets,
    marketsMap: marketsMap,
    isLoading,
  };
}

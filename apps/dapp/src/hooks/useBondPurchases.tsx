import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  BondPurchase,
  useListBondPurchasesMainnetQuery,
  useListBondPurchasesGoerliQuery,
  useListBondPurchasesArbitrumGoerliQuery,
  useListBondPurchasesArbitrumMainnetQuery,
} from "../generated/graphql";
import { CHAIN_ID, getAddressesByChain } from "@bond-protocol/bond-library";

export function useBondPurchases() {
  const endpoints = getSubgraphEndpoints();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedBondPurchases, setSelectedBondPurchases] = useState<
    BondPurchase[]
  >([]);
  const [bondPurchasesByMarket, setBondPurchasesByMarket] = useState<
    Map<string, BondPurchase[]>
  >(new Map());
  const [mainnetBondPurchases, setMainnetBondPurchases] = useState<
    BondPurchase[]
  >([]);
  const [testnetBondPurchases, setTestnetBondPurchases] = useState<
    BondPurchase[]
  >([]);

  const { data: mainnetData, ...mainnetQuery } =
    useListBondPurchasesMainnetQuery(
      { endpoint: endpoints[0] },
      { addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET) },
      { enabled: !testnet }
    );

  const { data: goerliData, ...goerliQuery } = useListBondPurchasesGoerliQuery(
    { endpoint: endpoints[1] },
    { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) },
    { enabled: !!testnet }
  );

  const { data: arbitrumMainnetData, ...arbitrumMainnetQuery } =
    useListBondPurchasesArbitrumMainnetQuery(
      { endpoint: endpoints[2] },
      { addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_MAINNET) },
      { enabled: !testnet }
    );

  const { data: arbitrumGoerliData, ...arbitrumGoerliQuery } = useListBondPurchasesArbitrumGoerliQuery(
    { endpoint: endpoints[3] },
    { addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_GOERLI_TESTNET)},
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.bondPurchases && arbitrumMainnetData && arbitrumMainnetData.bondPurchases) {
      const allBondPurchases =
        mainnetData.bondPurchases
          .concat(arbitrumMainnetData.bondPurchases);
      // @ts-ignore
      setMainnetBondPurchases(allBondPurchases);
    }
  }, [mainnetData, arbitrumMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.bondPurchases && arbitrumGoerliData && arbitrumGoerliData.bondPurchases) {
      const allBondPurchases =
        goerliData.bondPurchases
          .concat(arbitrumGoerliData.bondPurchases);
      // @ts-ignore
      setTestnetBondPurchases(allBondPurchases);
    }
  }, [goerliData, arbitrumGoerliData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedBondPurchases(testnetBondPurchases);
    } else {
      setSelectedBondPurchases(mainnetBondPurchases);
    }
  }, [testnet, mainnetBondPurchases, testnetBondPurchases]);

  useEffect(() => {
    const bondPurchasesByMarketMap: Map<string, BondPurchase[]> = new Map();

    selectedBondPurchases.forEach((bondPurchase) => {
      const array = bondPurchasesByMarketMap.get(bondPurchase.marketId) || [];
      array.push(bondPurchase);
      bondPurchasesByMarketMap.set(bondPurchase.marketId, array);
    });

    setBondPurchasesByMarket(bondPurchasesByMarketMap);
  }, [selectedBondPurchases]);

  const isLoading = testnet
    ? (goerliQuery.isLoading || arbitrumGoerliQuery.isLoading)
    : (mainnetQuery.isLoading || arbitrumMainnetQuery.isLoading);

  return {
    bondPurchases: selectedBondPurchases,
    purchasesByMarket: bondPurchasesByMarket,
    isLoading,
  };
}

import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import { BondPurchase, useListBondPurchasesQuery } from "../generated/graphql";
import { CHAIN_ID, getAddressesByChain } from "@bond-protocol/bond-library";

export function useBondPurchases() {
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

  const { data: ethMainnetData, ...ethMainnetQuery } = useListBondPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET),
      queryKey:CHAIN_ID.ETHEREUM_MAINNET + "-list-bond-purchases"
    },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListBondPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET),
      queryKey:CHAIN_ID.GOERLI_TESTNET + "-list-bond-purchases"
    },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListBondPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_MAINNET),
      queryKey:CHAIN_ID.ARBITRUM_MAINNET + "-list-bond-purchases"
    },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListBondPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    {
      addresses: getAddressesByChain(CHAIN_ID.ARBITRUM_GOERLI_TESTNET),
      queryKey:CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-bond-purchases"
    },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (ethMainnetData && ethMainnetData.bondPurchases && arbMainnetData && arbMainnetData.bondPurchases) {
      const allBondPurchases =
        ethMainnetData.bondPurchases
          .concat(arbMainnetData.bondPurchases);
      // @ts-ignore
      setMainnetBondPurchases(allBondPurchases);
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetData && ethTestnetData.bondPurchases && arbTestnetData && arbTestnetData.bondPurchases) {
      const allBondPurchases =
        ethTestnetData.bondPurchases
          .concat(arbTestnetData.bondPurchases);
      // @ts-ignore
      setTestnetBondPurchases(allBondPurchases);
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

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
    ? (ethTestnetQuery.isLoading || arbTestnetQuery.isLoading)
    : (ethMainnetQuery.isLoading || arbMainnetQuery.isLoading);

  return {
    bondPurchases: selectedBondPurchases,
    purchasesByMarket: bondPurchasesByMarket,
    isLoading,
  };
}

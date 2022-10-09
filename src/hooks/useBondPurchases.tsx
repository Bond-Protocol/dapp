import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useState} from "react";
import {BondPurchase, useListBondPurchasesMainnetQuery, useListBondPurchasesTestnetQuery,} from "../generated/graphql";
import {CHAIN_ID, getAddressesByChain} from "@bond-protocol/bond-library";

export function useBondPurchases() {
  const endpoints = getSubgraphEndpoints();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedBondPurchases, setSelectedBondPurchases] = useState<BondPurchase[]>([]);
  const [bondPurchasesMap, setBondPurchasesMap] = useState<Map<string, BondPurchase>>(new Map());
  const [mainnetBondPurchases, setMainnetBondPurchases] = useState<BondPurchase[]>([]);
  const [testnetBondPurchases, setTestnetBondPurchases] = useState<BondPurchase[]>([]);

  const {data: mainnetData, ...mainetQuery} = useListBondPurchasesMainnetQuery(
    {endpoint: endpoints[0]},
    {addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET)},
    {enabled: !testnet}
  );

  const {data: goerliData, ...testnetQuery} = useListBondPurchasesTestnetQuery(
    {endpoint: endpoints[1]},
    {addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET)},
    {enabled: !!testnet}
  );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.bondPurchases) {
      const allMarkets = mainnetData.bondPurchases;
      // @ts-ignore
      setMainnetMarkets(allMarkets);
    }
  }, [mainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.bondPurchases) {
      const allMarkets = goerliData.bondPurchases;
      // @ts-ignore
      setTestnetMarkets(allMarkets);
    }
  }, [goerliData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedBondPurchases(testnetBondPurchases);
    } else {
      setSelectedBondPurchases(mainnetBondPurchases);
    }
  }, [testnet, mainnetBondPurchases, testnetBondPurchases]);
}

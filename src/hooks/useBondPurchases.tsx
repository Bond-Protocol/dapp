import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  BondPurchase,
  useListBondPurchasesMainnetQuery,
  useListBondPurchasesTestnetQuery,
} from "../generated/graphql";
import {
  CHAIN_ID,
  getAddressesByChain,
  getProtocolByAddress,
} from "@bond-protocol/bond-library";
import { useTokens } from "hooks/useTokens";

export function useBondPurchases() {
  const endpoints = getSubgraphEndpoints();
  const { getPrice } = useTokens();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedBondPurchases, setSelectedBondPurchases] = useState<
    BondPurchase[]
  >([]);
  const [bondPurchasesByMarket, setBondPurchasesByMarket] = useState<
    Map<string, BondPurchase[]>
  >(new Map());
  const [tbvByProtocol, setTbvByProtocol] = useState<Map<string, number>>(
    new Map()
  );
  const [mainnetBondPurchases, setMainnetBondPurchases] = useState<
    BondPurchase[]
  >([]);
  const [testnetBondPurchases, setTestnetBondPurchases] = useState<
    BondPurchase[]
  >([]);

  const { data: mainnetData, ...mainetQuery } =
    useListBondPurchasesMainnetQuery(
      { endpoint: endpoints[0] },
      { addresses: getAddressesByChain(CHAIN_ID.ETHEREUM_MAINNET) },
      { enabled: !testnet }
    );

  const { data: goerliData, ...testnetQuery } =
    useListBondPurchasesTestnetQuery(
      { endpoint: endpoints[1] },
      { addresses: getAddressesByChain(CHAIN_ID.GOERLI_TESTNET) },
      { enabled: !!testnet }
    );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.bondPurchases) {
      const allBondPurchases = mainnetData.bondPurchases;
      // @ts-ignore
      setMainnetBondPurchases(allBondPurchases);
    }
  }, [mainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.bondPurchases) {
      const allBondPurchases = goerliData.bondPurchases;
      // @ts-ignore
      setTestnetBondPurchases(allBondPurchases);
    }
  }, [goerliData, testnet]);

  useEffect(() => {
    if (testnet) {
      setSelectedBondPurchases(testnetBondPurchases);
    } else {
      setSelectedBondPurchases(mainnetBondPurchases);
    }
  }, [testnet, mainnetBondPurchases, testnetBondPurchases]);

  useEffect(() => {
    const bondPurchasesByMarketMap: Map<string, BondPurchase[]> = new Map();
    const tbvByProtocolMap: Map<string, number> = new Map();
    selectedBondPurchases.forEach((bondPurchase) => {
      const array = bondPurchasesByMarketMap.get(bondPurchase.marketId) || [];
      array.push(bondPurchase);
      bondPurchasesByMarketMap.set(bondPurchase.marketId, array);

      const protocol = getProtocolByAddress(
        bondPurchase.owner,
        bondPurchase.network
      );
      if (!protocol) return;

      let value = tbvByProtocolMap.get(protocol.id) || 0;
      const price = getPrice(bondPurchase.quoteToken.id);
      value = value + bondPurchase.amount * price;
      tbvByProtocolMap.set(protocol.id, value);
    });

    setBondPurchasesByMarket(bondPurchasesByMarketMap);
    setTbvByProtocol(tbvByProtocolMap);
  }, [selectedBondPurchases]);

  return {
    bondPurchases: selectedBondPurchases,
    purchasesByMarket: bondPurchasesByMarket,
    tbvByProtocol: tbvByProtocol,
  };
}

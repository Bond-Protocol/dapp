import { useState, useEffect } from "react";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useListAllMarkets = () => {
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const { data: ethMainnetData, ...ethMainnetQuery } = useListAllPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-all-purchases" },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListAllPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-all-purchases" },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListAllPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-all-purchases" },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListAllPurchasesQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-all-purchases" },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (ethMainnetData?.bondPurchases.length && arbMainnetData?.bondPurchases.length) {
      //@ts-ignore
      setAllPurchases([...ethMainnetData?.bondPurchases, ...arbMainnetData?.bondPurchases]);
      setTotalPurchases(
        ethMainnetData.bondPurchases.length +
        arbMainnetData.bondPurchases.length
      );
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetData?.bondPurchases.length && arbTestnetData?.bondPurchases.length) {
      //@ts-ignore
      setAllPurchases([...ethTestnetData?.bondPurchases, ...arbTestnetData?.bondPurchases]);
      setTotalPurchases(
        ethTestnetData.bondPurchases.length +
        arbTestnetData.bondPurchases.length
      );
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

  return { allPurchases, totalPurchases };
};

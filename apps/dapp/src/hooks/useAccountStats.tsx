import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import {
  BondPurchase,
  useListBondPurchasesByAddressQuery,
} from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useAccountStats = () => {
  const account = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [purchases, setAllPurchases] = useState<BondPurchase[]>([]);
  const recipient = account?.address?.toLowerCase();

  const { data: ethMainnetData } = useListBondPurchasesByAddressQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    {
      recipient: recipient,
      queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-bond-purchases-by-address"
    },
  { enabled: !testnet }
  );

  const { data: ethTestnetData } = useListBondPurchasesByAddressQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    {
      recipient: recipient,
      queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-bond-purchases-by-address"
    },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData } = useListBondPurchasesByAddressQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    {
      recipient: recipient,
      queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-bond-purchases-by-address"
    },
    { enabled: !testnet }
  );

  const { data: arbTestnetData } = useListBondPurchasesByAddressQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    {
      recipient: recipient,
      queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-bond-purchases-by-address"
    },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (ethMainnetData?.bondPurchases && arbMainnetData?.bondPurchases) {
      //@ts-ignore
      setAllPurchases([...ethMainnetData?.bondPurchases, ...arbMainnetData?.bondPurchases]);
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetData?.bondPurchases && arbTestnetData?.bondPurchases) {
      //@ts-ignore
      setAllPurchases([...ethTestnetData?.bondPurchases, ...arbTestnetData?.bondPurchases]);
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

  return { purchases };
};

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import {
  BondPurchase,
  useListBondPurchasesByAddressQuery,
  useListBondPurchasesByAddressArbitrumQuery,
} from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";

export const useAccountStats = () => {
  const account = useAccount();
  const [purchases, setAllPurchases] = useState<BondPurchase[]>([]);
  const recipient = account?.address?.toLowerCase();

  const { data: arbitrum } = useListBondPurchasesByAddressArbitrumQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { recipient }
  );

  const { data: ethereum } = useListBondPurchasesByAddressQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { recipient }
  );

  useEffect(() => {
    if (ethereum?.bondPurchases && arbitrum?.bondPurchases) {
      //@ts-ignore
      setAllPurchases([...ethereum?.bondPurchases, ...arbitrum?.bondPurchases]);
    }
  }, [ethereum, arbitrum]);

  return { purchases };
};

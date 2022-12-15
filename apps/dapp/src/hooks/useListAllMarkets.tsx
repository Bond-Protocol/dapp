import { useState, useEffect } from "react";
import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { BondPurchase, useListAllPurchasesQuery } from "src/generated/graphql";

export const useListAllMarkets = () => {
  const endpoints = getSubgraphEndpoints();
  const [allPurchases, setAllPurchases] = useState<BondPurchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const { data: ethereum, ...ethQuery } = useListAllPurchasesQuery(
    {
      endpoint: endpoints[0],
    },
    {},
    { queryKey: "eth-all-purchases" }
  );

  const { data: arbitrum, ...arbQuery } = useListAllPurchasesQuery(
    {
      endpoint: endpoints[2],
    },
    undefined,
    { queryKey: "arbi-all-purchases" }
  );

  useEffect(() => {
    if (arbitrum?.bondPurchases.length && ethereum?.bondPurchases.length) {
      //@ts-ignore
      setAllPurchases([...ethereum?.bondPurchases, ...arbitrum?.bondPurchases]);
      setTotalPurchases(
        arbitrum.bondPurchases.length + ethereum.bondPurchases.length
      );
    }
  }, [arbitrum, ethereum]);

  return { allPurchases, totalPurchases };
};

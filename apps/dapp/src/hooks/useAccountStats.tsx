import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  BondPurchase,
  useListBondPurchasesByAddressQuery,
} from "src/generated/graphql";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export const useAccountStats = () => {
  const account = useAccount();
  const recipient = account?.address?.toLowerCase();

  const subgraphQueries = getSubgraphQueries(
    useListBondPurchasesByAddressQuery,
    { recipient: recipient }
  );
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [accountPurchases, setAllAccountPurchases] = useState<BondPurchase[]>(
    []
  );

  useEffect(() => {
    if (isLoading) return;
    setAllAccountPurchases(
      concatSubgraphQueryResultArrays(subgraphQueries, "bondPurchases")
    );
  }, [isLoading, isTestnet]);

  return { purchases: accountPurchases };
};

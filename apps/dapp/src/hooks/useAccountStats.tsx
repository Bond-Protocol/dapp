import {useEffect, useMemo, useState} from "react";
import {useAccount} from "wagmi";
import {BondPurchase, useListBondPurchasesByAddressQuery,} from "src/generated/graphql";
import {getSubgraphQueries} from "services/subgraph-endpoints";

export const useAccountStats = () => {
  const account = useAccount();
  const recipient = account?.address?.toLowerCase();
  const subgraphQueries = getSubgraphQueries(useListBondPurchasesByAddressQuery, { recipient: recipient });

  const [accountPurchases, setAllAccountPurchases] = useState<BondPurchase[]>([]);

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map(value => value.isLoading)
      .reduce((previous, current) => previous || current)
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setAllAccountPurchases(
      subgraphQueries
        .map(value => value.data.bondPurchases)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading]);

  return {purchases: accountPurchases};
};

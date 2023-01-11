import { getSubgraphQueries } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useMemo, useState } from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerQuery,
  useListErc20BondTokensQuery,
} from "../generated/graphql";
import { useAccount } from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";

export function useMyBonds() {
  const { address } = useAccount();

  const ownerBalanceSubgraphQueries = getSubgraphQueries(
    useGetOwnerBalancesByOwnerQuery,
    { owner: address || "" }
  );
  const erc20SubgraphQueries = getSubgraphQueries(useListErc20BondTokensQuery);

  const [isTestnet] = useAtom(testnetMode);
  const [ownerBalances, setOwnerBalances] = useState<Partial<OwnerBalance>[]>(
    []
  );
  const [erc20OwnerBalances, setErc20OwnerBalances] = useState<
    Partial<OwnerBalance>[]
  >([]);
  const [myBonds, setMyBonds] = useState<Partial<OwnerBalance>[]>([]);

  const ownerBalanceIsLoading = useMemo(() => {
    return ownerBalanceSubgraphQueries
      .map((value) => value.isLoading || value.isRefetching)
      .reduce((previous, current) => previous || current);
  }, [ownerBalanceSubgraphQueries, ownerBalances]);

  const erc20BalanceIsLoading = useMemo(() => {
    return erc20SubgraphQueries
      .map((value) => value.isLoading)
      .reduce((previous, current) => previous || current);
  }, [erc20SubgraphQueries, erc20OwnerBalances]);

  const getErc20Balances = () => {
    if (!address) return;

    const bondTokens: BondToken[] = erc20SubgraphQueries
      .map((value) => value.data.bondTokens)
      .reduce((previous, current) => previous.concat(current));

    const ownerBalances: Partial<OwnerBalance>[] = [];
    const promises: Promise<any>[] = [];
    bondTokens.forEach((bondToken) => {
      if (
        bondToken.teller.toLowerCase() ===
        "0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156".toLowerCase()
      )
        return;
      address &&
        promises.push(
          contractLibrary
            .getBalance(bondToken.id, address, providers[bondToken.chainId])
            .then((result) => {
              if (Number(result) > 0) {
                // Now we have all the data required to make an OwnerBalances object
                const balance = result;
                ownerBalances.push({
                  balance: balance,
                  bondToken: bondToken,
                  owner: address,
                });
              }
            })
        );
    });

    void Promise.allSettled(promises).then(() => {
      setErc20OwnerBalances(ownerBalances);
    });
  };

  useEffect(() => {
    if (ownerBalanceIsLoading) return;

    setOwnerBalances(
      ownerBalanceSubgraphQueries
        .map((value) => value.data.ownerBalances)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [ownerBalanceIsLoading, isTestnet]);

  /*
  For bonds with ERC-20 rather than ERC-1155 bond tokens, we can't get the balances
  from the subgraph and need to check them manually.
   */
  useEffect(() => {
    if (erc20BalanceIsLoading) return;
    getErc20Balances();
  }, [erc20BalanceIsLoading, isTestnet, address]);

  useEffect(() => {
    if (ownerBalanceIsLoading || erc20BalanceIsLoading) return;

    ownerBalanceSubgraphQueries.forEach((query) => query.refetch());
    setOwnerBalances([]);
    getErc20Balances();
  }, [address, isTestnet]);

  useEffect(() => {
    const updatedBonds = [...ownerBalances, ...erc20OwnerBalances];
    setMyBonds(updatedBonds);
  }, [ownerBalances, erc20OwnerBalances]);

  return {
    myBonds: myBonds,
    isLoading: ownerBalanceIsLoading || erc20BalanceIsLoading,
  };
}

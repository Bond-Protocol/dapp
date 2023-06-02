import { getSubgraphQueries } from "services";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerQuery,
  useListErc20BondTokensQuery,
} from "../generated/graphql";
import { useAccount, useChainId } from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useTokens } from "./useTokens";
import { calculateTrimDigits, trim } from "@bond-protocol/contract-library";

export function useMyBonds() {
  const { address } = useAccount();
  const { tokens, getByAddress } = useTokens();
  const chainId = useChainId();

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

  const { isLoading: ownerBalanceIsLoading } = useSubgraphLoadingCheck(
    ownerBalanceSubgraphQueries,
    [ownerBalances]
  );
  const { isLoading: erc20BalanceIsLoading } = useSubgraphLoadingCheck(
    erc20SubgraphQueries,
    [erc20OwnerBalances]
  );

  const [myBonds, setMyBonds] = useState<Partial<OwnerBalance>[]>([]);

  const getErc20Balances = () => {
    if (!address) return;

    const bondTokens: BondToken[] = concatSubgraphQueryResultArrays(
      erc20SubgraphQueries,
      "bondTokens"
    );

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
      concatSubgraphQueryResultArrays(
        ownerBalanceSubgraphQueries,
        "ownerBalances"
      )
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

    setOwnerBalances(
      concatSubgraphQueryResultArrays(
        ownerBalanceSubgraphQueries,
        "ownerBalances"
      )
    );
    getErc20Balances();
  }, [address, isTestnet]);

  useEffect(() => {
    const updatedBonds = [...ownerBalances, ...erc20OwnerBalances].map(
      (bond: Partial<OwnerBalance>) => {
        if (!bond.bondToken || !bond.bondToken.underlying) return;
        const date = new Date(bond.bondToken.expiry * 1000);
        const now = new Date(Date.now());
        const canClaim = now >= date;

        //const purchase = purchases?.data?.bondPurchases.find();
        const underlying = getByAddress(bond.bondToken?.underlying.address);

        let balance: number | string =
          bond.balance / Math.pow(10, bond.bondToken.underlying.decimals);
        balance = trim(balance, calculateTrimDigits(balance));

        const usdPriceNumber: number = underlying?.price
          ? underlying.price * Number(balance)
          : 0;
        const usdPriceString: string = usdPriceNumber
          ? trim(usdPriceNumber, calculateTrimDigits(usdPriceNumber))
          : "???";

        const isCorrectNetwork = Number(bond.bondToken.chainId) === chainId;

        return {
          bond,
          balance,
          usdPriceString,
          usdPriceNumber,
          underlying,
          isCorrectNetwork,
          canClaim,
        };
      }
    );

    console.log({ updatedBonds });
    setMyBonds(updatedBonds);
  }, [ownerBalances, erc20OwnerBalances, tokens]);

  return {
    myBonds: myBonds,
    isLoading: ownerBalanceIsLoading || erc20BalanceIsLoading,
  };
}

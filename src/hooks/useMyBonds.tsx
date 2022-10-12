//@ts-nocheck
import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { useEffect, useState } from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerGoerliQuery,
  useGetOwnerBalancesByOwnerMainnetQuery,
  useListErc20BondTokensGoerliQuery,
  useListErc20BondTokensMainnetQuery,
} from "../generated/graphql";
import { useAccount } from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";

export function useMyBonds() {
  const endpoints = getSubgraphEndpoints();

  const { address } = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [testnetBonds, setTestnetBonds] = useState<OwnerBalance[]>([]);
  const [mainnetBonds, setMainnetBonds] = useState<OwnerBalance[]>([]);
  const [testnetErc20Bonds, setTestnetErc20Bonds] = useState<OwnerBalance[]>(
    []
  );
  const [mainnetErc20Bonds, setMainnetErc20Bonds] = useState<OwnerBalance[]>(
    []
  );
  const [myBonds, setMyBonds] = useState<OwnerBalance[]>([]);
  const [refetchRequest, setRefetchRequest] = useState(0);

  /*
  Load the data from the subgraph.
  Unfortunately we currently need a separate endpoint for each chain, and a separate set of GraphQL queries for each chain.
   */
  const {
    data: mainnetData,
    refetch: mainnetRefetch,
    ...mainnetQuery
  } = useGetOwnerBalancesByOwnerMainnetQuery(
    { endpoint: endpoints[0] },
    { owner: address },
    { enabled: !testnet }
  );

  const {
    data: goerliData,
    refetch: goerliRefetch,
    ...testnetQuery
  } = useGetOwnerBalancesByOwnerGoerliQuery(
    { endpoint: endpoints[1] },
    { owner: address },
    { enabled: !!testnet }
  );

  const {
    data: mainnetErc20Data,
    refetch: mainnetErc20Refetch,
    ...mainERC20Query
  } = useListErc20BondTokensMainnetQuery(
    { endpoint: endpoints[0] },
    { enabled: !testnet }
  );

  const {
    data: goerliErc20Data,
    refetch: goerliErc20Refetch,
    ...testnetERC20Query
  } = useListErc20BondTokensGoerliQuery(
    { endpoint: endpoints[1] },
    { enabled: !!testnet }
  );

  const refetchQueries = () => {
    if (testnet) {
      void goerliRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void goerliErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
    } else {
      void mainnetRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void mainnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
    }
  };

  const getBalances = (bondTokens: BondToken[]) => {
    if (!address) return;

    const ownerBalances: OwnerBalance[] = [];
    const promises: Promise<any>[] = [];
    bondTokens.forEach((bondToken) => {
      address &&
        promises.push(
          contractLibrary
            .getBalance(bondToken.id, address, providers[bondToken.network])
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
      if (testnet) {
        setTestnetErc20Bonds(ownerBalances);
      } else {
        setMainnetErc20Bonds(ownerBalances);
      }
    });
  };

  /*
  We get a list of all user bonds by concatenating the .bondTokens data from each Subgraph request.
   */
  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.ownerBalances) {
      const allTokens = mainnetData.ownerBalances;
      // @ts-ignore
      setMainnetBonds(allTokens);
    }
  }, [mainnetData, refetchRequest]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.ownerBalances) {
      const allTokens = goerliData.ownerBalances;
      // @ts-ignore
      setTestnetBonds(allTokens);
    }
  }, [goerliData, refetchRequest]);

  /*
  If the user switches between mainnet/testnet mode, update myBonds.
   */
  useEffect(() => {
    let bonds = testnet ? testnetBonds : mainnetBonds;
    const erc20Bonds = testnet ? testnetErc20Bonds : mainnetErc20Bonds;

    bonds = bonds.concat(erc20Bonds);

    setMyBonds(
      bonds.sort(
        // @ts-ignore
        (n1: OwnerBalance, n2: OwnerBalance) =>
          n1.bondToken.expiry - n2.bondToken.expiry
      )
    );
  }, [
    testnet,
    mainnetBonds,
    testnetBonds,
    mainnetErc20Bonds,
    testnetErc20Bonds,
  ]);

  /*
  For bonds with ERC-20 rather than ERC-1155 bond tokens, we can't get the balances
  from the subgraph and need to check them manually.
   */
  useEffect(() => {
    if (testnet) return;
    if (mainnetErc20Data) {
      const bondTokens = mainnetErc20Data.bondTokens;
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, mainnetErc20Data]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliErc20Data) {
      const bondTokens = goerliErc20Data.bondTokens;
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, goerliErc20Data]);

  /*
  myBonds: An array of bonds owned by the currently connected wallet
   */
  return {
    myBonds: myBonds,
    refetch: () => refetchQueries(),
    isLoading: testnet
      ? testnetQuery.isLoading || testnetERC20Query.isLoading
      : mainnetQuery.isLoading || mainERC20Query.isLoading,
  };
}

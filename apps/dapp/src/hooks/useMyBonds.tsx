import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useState} from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerArbitrumGoerliQuery,
  useGetOwnerBalancesByOwnerArbitrumMainnetQuery,
  useGetOwnerBalancesByOwnerGoerliQuery,
  useGetOwnerBalancesByOwnerMainnetQuery,
  useListErc20BondTokensArbitrumGoerliQuery,
  useListErc20BondTokensArbitrumMainnetQuery,
  useListErc20BondTokensGoerliQuery,
  useListErc20BondTokensMainnetQuery,
} from "../generated/graphql";
import {useAccount} from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import {providers} from "services/owned-providers";

export function useMyBonds() {
  const endpoints = getSubgraphEndpoints();

  const {address} = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [testnetBonds, setTestnetBonds] = useState<Partial<OwnerBalance>[]>([]);
  const [mainnetBonds, setMainnetBonds] = useState<Partial<OwnerBalance>[]>([]);
  const [testnetErc20Bonds, setTestnetErc20Bonds] = useState<Partial<OwnerBalance>[]>([]);
  const [mainnetErc20Bonds, setMainnetErc20Bonds] = useState<Partial<OwnerBalance>[]>([]);
  const [myBonds, setMyBonds] = useState<Partial<OwnerBalance>[]>([]);
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
    {endpoint: endpoints[0]},
    {owner: address || ""},
    {enabled: !testnet}
  );

  const {
    data: goerliData,
    refetch: goerliRefetch,
    ...goerliQuery
  } = useGetOwnerBalancesByOwnerGoerliQuery(
    {endpoint: endpoints[1]},
    {owner: address || ""},
    {enabled: !!testnet}
  );
  const {
    data: arbitrumMainnetData,
    refetch: arbitrumMainnetRefetch,
    ...arbitrumMainnetQuery
  } = useGetOwnerBalancesByOwnerArbitrumMainnetQuery(
    {endpoint: endpoints[2]},
    {owner: address || ""},
    {enabled: !testnet}
  );

  const {
    data: arbitrumGoerliData,
    refetch: arbitrumGoerliRefetch,
    ...arbitrumGoerliQuery
  } = useGetOwnerBalancesByOwnerArbitrumGoerliQuery(
    {endpoint: endpoints[3]},
    {owner: address || ""},
    {enabled: !!testnet}
  );

  const {
    data: mainnetErc20Data,
    refetch: mainnetErc20Refetch,
    ...mainnetErc20Query
  } = useListErc20BondTokensMainnetQuery(
    {endpoint: endpoints[0]},
    // @ts-ignore
    {enabled: !testnet}
  );

  const {
    data: goerliErc20Data,
    refetch: goerliErc20Refetch,
    ...goerliErc20Query
  } = useListErc20BondTokensGoerliQuery(
    {endpoint: endpoints[1]},
    // @ts-ignore
    {enabled: !!testnet}
  );

  const {
    data: arbitrumMainnetErc20Data,
    refetch: arbitrumMainnetErc20Refetch,
    ...arbitrumMainnetErc20Query
  } = useListErc20BondTokensArbitrumMainnetQuery(
    {endpoint: endpoints[2]},
    // @ts-ignore
    {enabled: !testnet}
  );

  const {
    data: arbitrumGoerliErc20Data,
    refetch: arbitrumGoerliErc20Refetch,
    ...arbitrumGoerliErc20Query
  } = useListErc20BondTokensArbitrumGoerliQuery(
    {endpoint: endpoints[3]},
    // @ts-ignore
    {enabled: !!testnet}
  );

  const refetchQueries = () => {
    if (testnet) {
      void goerliRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void goerliErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
      void arbitrumGoerliRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void arbitrumGoerliErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
    } else {
      void mainnetRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void mainnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
      void arbitrumMainnetRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void arbitrumMainnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
    }
  };

  const getBalances = (bondTokens: BondToken[]) => {
    if (!address) return;

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
    if (mainnetData && mainnetData.ownerBalances && arbitrumMainnetData && arbitrumMainnetData.ownerBalances) {
      const allTokens =
        mainnetData.ownerBalances
          .concat(arbitrumMainnetData.ownerBalances);
      // @ts-ignore
      setMainnetBonds(allTokens);
    }
  }, [mainnetData, arbitrumMainnetData, refetchRequest, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.ownerBalances && arbitrumGoerliData && arbitrumGoerliData.ownerBalances) {
      const allTokens =
        goerliData.ownerBalances
          .concat(arbitrumGoerliData.ownerBalances);
      // @ts-ignore
      setTestnetBonds(allTokens);
    }
  }, [goerliData, arbitrumGoerliData, refetchRequest, testnet]);

  /*
  If the user switches between mainnet/testnet mode, update myBonds.
   */
  useEffect(() => {
    let bonds = testnet ? testnetBonds : mainnetBonds;
    const erc20Bonds = testnet ? testnetErc20Bonds : mainnetErc20Bonds;

    bonds = bonds.concat(erc20Bonds);

    setMyBonds(
      bonds.sort(
        (n1: Partial<OwnerBalance>, n2: Partial<OwnerBalance>) =>
          // @ts-ignore
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
    if (mainnetErc20Data && arbitrumMainnetErc20Data) {
      const bondTokens =
        mainnetErc20Data.bondTokens
          .concat(arbitrumMainnetErc20Data.bondTokens);
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, mainnetErc20Data, arbitrumMainnetErc20Data, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliErc20Data && arbitrumGoerliErc20Data) {
      const bondTokens =
        goerliErc20Data.bondTokens
          .concat(arbitrumGoerliErc20Data.bondTokens);
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, goerliErc20Data, arbitrumGoerliErc20Data, testnet]);

  const isLoading = testnet
    ? (
      goerliQuery.isLoading || goerliErc20Query.isLoading ||
      arbitrumGoerliQuery.isLoading || arbitrumGoerliErc20Query.isLoading
    )
    : (
      mainnetQuery.isLoading || mainnetErc20Query.isLoading ||
      arbitrumMainnetQuery.isLoading || arbitrumMainnetErc20Query.isLoading
    );

  /*
  myBonds: An array of bonds owned by the currently connected wallet
   */
  return {
    myBonds: myBonds,
    refetch: () => refetchQueries(),
    isLoading
  };
}

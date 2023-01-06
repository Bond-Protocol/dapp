import { subgraphEndpoints } from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useState} from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerQuery,
  useListErc20BondTokensQuery,
} from "../generated/graphql";
import {useAccount} from "wagmi";
import * as contractLibrary from "@bond-protocol/contract-library";
import {providers} from "services/owned-providers";
import {CHAIN_ID} from "@bond-protocol/bond-library";

export function useMyBonds() {
  const {address} = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [testnetBonds, setTestnetBonds] = useState<Partial<OwnerBalance>[]>([]);
  const [mainnetBonds, setMainnetBonds] = useState<Partial<OwnerBalance>[]>([]);
  const [testnetErc20Bonds, setTestnetErc20Bonds] = useState<Partial<OwnerBalance>[]>([]);
  const [mainnetErc20Bonds, setMainnetErc20Bonds] = useState<Partial<OwnerBalance>[]>([]);
  const [myBonds, setMyBonds] = useState<Partial<OwnerBalance>[]>([]);
  const [refetchRequest, setRefetchRequest] = useState(0);

  const {
    data: ethMainnetOwnerBalancesData,
    refetch: ethMainnetOwnerBalancesRefetch,
    ...ethMainnetOwnerBalancesQuery
  } = useGetOwnerBalancesByOwnerQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    {
      owner: address || "",
      queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-get-owner-balances-by-owner"
    },
    { enabled: !testnet }
  );

  const {
    data: ethTestnetOwnerBalancesData,
    refetch: ethTestnetOwnerBalancesRefetch,
    ...ethTestnetOwnerBalancesQuery
  } = useGetOwnerBalancesByOwnerQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    {
      owner: address || "",
      queryKey: CHAIN_ID.GOERLI_TESTNET + "-get-owner-balances-by-owner"
    },
    { enabled: !!testnet }
  );
  const {
    data: arbMainnetOwnerBalancesData,
    refetch: arbMainnetOwnerBalancesRefetch,
    ...arbMainnetOwnerBalancesQuery
  } = useGetOwnerBalancesByOwnerQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    {
      owner: address || "",
      queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-get-owner-balances-by-owner"
    },
    { enabled: !testnet }
  );

  const {
    data: arbTestnetOwnerBalancesData,
    refetch: arbTestnetOwnerBalancesRefetch,
    ...arbTestnetOwnerBalancesQuery
  } = useGetOwnerBalancesByOwnerQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    {
      owner: address || "",
      queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-get-owner-balances-by-owner"
    },
    { enabled: !!testnet }
  );

  const {
    data: ethMainnetErc20Data,
    refetch: ethMainnetErc20Refetch,
    ...ethMainnetErc20Query
  } = useListErc20BondTokensQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-erc20-bond-tokens" },
    { enabled: !testnet }
  );

  const {
    data: ethTestnetErc20Data,
    refetch: ethTestnetErc20Refetch,
    ...ethTestnetErc20Query
  } = useListErc20BondTokensQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.GOERLI_TESTNET + "-erc20-bond-tokens" },
    { enabled: !!testnet }
  );

  const {
    data: arbMainnetErc20Data,
    refetch: arbMainnetErc20Refetch,
    ...arbMainnetErc20Query
  } = useListErc20BondTokensQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-erc20-bond-tokens" },
    { enabled: !testnet }
  );

  const {
    data: arbTestnetErc20Data,
    refetch: arbTestnetErc20Refetch,
    ...arbTestnetErc20Query
  } = useListErc20BondTokensQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-erc20-bond-tokens" },
    { enabled: !!testnet }
  );

  const refetchQueries = () => {
    if (testnet) {
      void ethTestnetOwnerBalancesRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void ethTestnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
      void arbTestnetOwnerBalancesRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void arbTestnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
    } else {
      void ethMainnetOwnerBalancesRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void ethMainnetErc20Refetch().then(() =>
        setRefetchRequest(refetchRequest + 1)
      );
      void arbMainnetOwnerBalancesRefetch().then(() => setRefetchRequest(refetchRequest + 1));
      void arbMainnetErc20Refetch().then(() =>
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
    if (ethMainnetOwnerBalancesData && ethMainnetOwnerBalancesData.ownerBalances && arbMainnetOwnerBalancesData && arbMainnetOwnerBalancesData.ownerBalances) {
      const allTokens =
        ethMainnetOwnerBalancesData.ownerBalances
          .concat(arbMainnetOwnerBalancesData.ownerBalances);
      // @ts-ignore
      setMainnetBonds(allTokens);
    }
  }, [ethMainnetOwnerBalancesData, arbMainnetOwnerBalancesData, refetchRequest, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetOwnerBalancesData && ethTestnetOwnerBalancesData.ownerBalances && arbTestnetOwnerBalancesData && arbTestnetOwnerBalancesData.ownerBalances) {
      const allTokens =
        ethTestnetOwnerBalancesData.ownerBalances
          .concat(arbTestnetOwnerBalancesData.ownerBalances);
      // @ts-ignore
      setTestnetBonds(allTokens);
    }
  }, [ethTestnetOwnerBalancesData, arbTestnetOwnerBalancesData, refetchRequest, testnet]);

  /*
  If the user switches between mainnet/testnet mode, update myBonds.
   */
  useEffect(() => {
    let bonds = testnet ? testnetBonds : mainnetBonds;
    const erc20Bonds = testnet ? testnetErc20Bonds : mainnetErc20Bonds;

    const updatedBonds = [...bonds, ...erc20Bonds];

    setMyBonds(updatedBonds);
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
    if (ethMainnetErc20Data && arbMainnetErc20Data) {
      const bondTokens =
        ethMainnetErc20Data.bondTokens
          .concat(arbMainnetErc20Data.bondTokens);
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, ethMainnetErc20Data, arbMainnetErc20Data, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetErc20Data && arbTestnetErc20Data) {
      const bondTokens =
        ethTestnetErc20Data.bondTokens
          .concat(arbTestnetErc20Data.bondTokens);
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, ethTestnetErc20Data, arbTestnetErc20Data, testnet]);

  const isLoading = testnet
    ? (
      ethTestnetOwnerBalancesQuery.isLoading || ethTestnetErc20Query.isLoading ||
      arbTestnetOwnerBalancesQuery.isLoading || arbTestnetErc20Query.isLoading
    )
    : (
      ethMainnetOwnerBalancesQuery.isLoading || ethMainnetErc20Query.isLoading ||
      arbMainnetOwnerBalancesQuery.isLoading || arbMainnetErc20Query.isLoading
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

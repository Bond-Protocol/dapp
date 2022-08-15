import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useState} from "react";
import {
  BondToken,
  OwnerBalance,
  useGetOwnerBalancesByOwnerGoerliQuery,
  useGetOwnerBalancesByOwnerRinkebyQuery,
  useListErc20BondTokensGoerliQuery,
  useListErc20BondTokensRinkebyQuery
} from "../generated/graphql";
import {useAccount} from "wagmi";
import * as contractLibrary from "@bond-labs/contract-library";
import {providers} from "services/owned-providers";

export function useMyBonds() {
  const endpoints = getSubgraphEndpoints();

  const {address} = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [testnetBonds, setTestnetBonds] = useState<OwnerBalance[]>([]);
  const [mainnetBonds, setMainnetBonds] = useState<OwnerBalance[]>([]);
  const [testnetErc20Bonds, setTestnetErc20Bonds] = useState<OwnerBalance[]>([]);
  const [mainnetErc20Bonds, setMainnetErc20Bonds] = useState<OwnerBalance[]>([]);
  const [myBonds, setMyBonds] = useState<OwnerBalance[]>([]);
  const [refetchRequest, setRefetchRequest] = useState(0);

  /*
  Load the data from the subgraph.
  Unfortunately we currently need a separate endpoint for each chain, and a separate set of GraphQL queries for each chain.
   */
  const {data: rinkebyData, refetch: rinkebyRefetch} = useGetOwnerBalancesByOwnerRinkebyQuery(
    {endpoint: endpoints[0]},
    {owner: address}
  );
  const {data: goerliData, refetch: goerliRefetch} = useGetOwnerBalancesByOwnerGoerliQuery(
    {endpoint: endpoints[1]},
    {owner: address}
  );
  const {data: rinkebyErc20Data, refetch: rinkebyErc20Refetch} = useListErc20BondTokensRinkebyQuery(
    {endpoint: endpoints[0]},
  );
  const {data: goerliErc20Data, refetch: goerliErc20Refetch} = useListErc20BondTokensGoerliQuery(
    {endpoint: endpoints[1]},
  );

  const refetchQueries = () => {
    void rinkebyRefetch().then(() => setRefetchRequest(refetchRequest + 1));
    void goerliRefetch().then(() => setRefetchRequest(refetchRequest + 1));
    void rinkebyErc20Refetch().then(() => setRefetchRequest(refetchRequest + 1));
    void goerliErc20Refetch().then(() => setRefetchRequest(refetchRequest + 1));
  };

  const getBalances = (bondTokens: BondToken[]) => {
    if (!address) return;

    const ownerBalances: OwnerBalance[] = [];
    const promises: Promise<any>[] = [];
    bondTokens.forEach(bondToken => {
      address && promises.push(
        contractLibrary.getBalance(bondToken.id, address, providers[bondToken.network])
          .then((result) => {
            if (Number(result) > 0) {
              // Now we have all the data required to make an OwnerBalances object
              const balance = Number(result);
              ownerBalances.push({
                balance: balance,
                bondToken: bondToken,
                id: bondToken.id,
                network: bondToken.network,
                owner: address,
                tokenId: bondToken.id
              });
            }
          })
      );
    });

    void Promise.allSettled(promises).then(() => {
      setTestnetErc20Bonds(ownerBalances);
    });
  };

  /*
  We get a list of all user bonds by concatenating the .bondTokens data from each Subgraph request.
   */
  useEffect(() => {
    if (rinkebyData && rinkebyData.ownerBalances && goerliData && goerliData.ownerBalances) {
      const allTokens = rinkebyData.ownerBalances.concat(goerliData.ownerBalances);
      // @ts-ignore
      setTestnetBonds(allTokens);
    }
  }, [rinkebyData, goerliData, refetchRequest]);

  /*
  If the user switches between mainnet/testnet mode, update myBonds.
   */
  useEffect(() => {
    let bonds = testnet ? testnetBonds : mainnetBonds;
    const erc20Bonds = testnet ? testnetErc20Bonds : mainnetErc20Bonds;

    bonds = bonds.concat(erc20Bonds);

    setMyBonds(bonds.sort(
      // @ts-ignore
      (n1: OwnerBalance, n2: OwnerBalance) => n1.bondToken.expiry - n2.bondToken.expiry)
    );

  }, [testnet, mainnetBonds, testnetBonds, mainnetErc20Bonds, testnetErc20Bonds]);

  /*
  For bonds with ERC-20 rather than ERC-1155 bond tokens, we can't get the balances
  from the subgraph and need to check them manually.
   */
  useEffect(() => {
    if (rinkebyErc20Data && goerliErc20Data) {
      const bondTokens = rinkebyErc20Data.bondTokens.concat(goerliErc20Data.bondTokens);
      // @ts-ignore
      getBalances(bondTokens);
    }
  }, [address, rinkebyErc20Data, goerliErc20Data]);

  /*
  myBonds: An array of bonds owned by the currently connected wallet
   */
  return {
    myBonds: myBonds,
    refetch: () => refetchQueries(),
  };
}

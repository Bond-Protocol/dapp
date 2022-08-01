import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {useEffect, useState} from "react";
import {OwnerBalance, useGetOwnerBalancesByOwnerGoerliQuery, useGetOwnerBalancesByOwnerRinkebyQuery} from "../generated/graphql";
import {useAccount} from "wagmi";

export function useMyBonds() {
  const endpoints = getSubgraphEndpoints();

  const {address} = useAccount();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [testnetBonds, setTestnetBonds] = useState<OwnerBalance[]>([]);
  const [mainnetBonds, setMainnetBonds] = useState<OwnerBalance[]>([]);
  const [myBonds, setMyBonds] = useState<OwnerBalance[]>([]);
  const [refetchRequest, setRefetchRequest] = useState(0);

  /*
  Load the data from the subgraph.
  Unfortunately we currently need a separate endpoint for each chain, and a separate set of GraphQL queries for each chain.
   */
  const {data: rinkebyData, refetch: rinkebyRefetch} = useGetOwnerBalancesByOwnerRinkebyQuery(
    {endpoint: endpoints[0]},
    {owner: address || ""}
  );
  const {data: goerliData, refetch: goerliRefetch} = useGetOwnerBalancesByOwnerGoerliQuery(
    {endpoint: endpoints[1]},
    {owner: address || ""}
  );

  const refetchQueries = () => {
    void rinkebyRefetch().then(() => setRefetchRequest(refetchRequest + 1));
    void goerliRefetch().then(() => setRefetchRequest(refetchRequest + 1));
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
    if (testnet) {
      setMyBonds(testnetBonds.sort(
        // @ts-ignore
        (n1: OwnerBalance, n2: OwnerBalance) => n1.bondToken.expiry - n2.bondToken.expiry)
      );
    } else {
      setMyBonds(mainnetBonds.sort(
        // @ts-ignore
        (n1: OwnerBalance, n2: OwnerBalance) => n1.bondToken.expiry - n2.bondToken.expiry)
      );
    }
  }, [testnet, mainnetBonds, testnetBonds]);


  /*
  myBonds: An array of bonds owned by the currently connected wallet
   */
  return {
    myBonds: myBonds,
    refetch: () => refetchQueries(),
  };
}

import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useTokens} from "hooks/useTokens";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {
  OwnerTokenTbv,
  useListOwnerTokenTbvsArbitrumGoerliQuery,
  useListOwnerTokenTbvsArbitrumMainnetQuery,
  useListOwnerTokenTbvsGoerliQuery,
  useListOwnerTokenTbvsMainnetQuery,
} from "../generated/graphql";
import {useEffect, useState} from "react";
import {getProtocolByAddress} from "@bond-protocol/bond-library";

export function useOwnerTokenTbvs() {
  const endpoints = getSubgraphEndpoints();
  const {getPrice, currentPrices} = useTokens();
  const [testnet, setTestnet] = useAtom(testnetMode);

  const [protocolTbvs, setProtocolTbvs] = useState<Map<string, number>>();
  const [mainnetOwnerTokenTbvs, setMainnetOwnerTokenTbvs] = useState<OwnerTokenTbv[]>([]);
  const [testnetOwnerTokenTbvs, setTestnetOwnerTokenTbvs] = useState<OwnerTokenTbv[]>([]);

  const {data: mainnetData, ...mainnetQuery} =
    useListOwnerTokenTbvsMainnetQuery(
      {endpoint: endpoints[0]},
      {},
      {enabled: !testnet}
    );

  const {data: goerliData, ...goerliQuery} =
    useListOwnerTokenTbvsGoerliQuery(
      {endpoint: endpoints[1]},
      {},
      {enabled: !!testnet}
    );

  const {data: arbitrumMainnetData, ...arbitrumMainnetQuery} =
    useListOwnerTokenTbvsArbitrumMainnetQuery(
      {endpoint: endpoints[2]},
      {},
      {enabled: !testnet}
    );

  const {data: arbitrumGoerliData, ...arbitrumGoerliQuery} =
    useListOwnerTokenTbvsArbitrumGoerliQuery(
      {endpoint: endpoints[3]},
      {},
      {enabled: !!testnet}
    );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.ownerTokenTbvs && arbitrumMainnetData && arbitrumMainnetData.ownerTokenTbvs) {
      const allOwnerTokens =
        mainnetData.ownerTokenTbvs
          .concat(arbitrumMainnetData.ownerTokenTbvs);
      // @ts-ignore
      setMainnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [mainnetData, arbitrumMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.ownerTokenTbvs && arbitrumGoerliData && arbitrumGoerliData.ownerTokenTbvs) {
      const allOwnerTokens =
        goerliData.ownerTokenTbvs
          .concat(arbitrumGoerliData.ownerTokenTbvs);
      // @ts-ignore
      setTestnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [goerliData, arbitrumGoerliData, testnet]);

  useEffect(() => {
    const ownerTokenTbvMap: Map<string, number> = new Map();
    let selected;
    if (testnet) {
      selected = testnetOwnerTokenTbvs;
    } else {
      selected = mainnetOwnerTokenTbvs;
    }

    selected.forEach((ownerTokenTbv) => {
      const protocol = getProtocolByAddress(
        ownerTokenTbv.owner,
        ownerTokenTbv.network
      );
      if (!protocol) return;

      let value = ownerTokenTbvMap.get(protocol.id) || 0;
      const price = getPrice(ownerTokenTbv.token);
      value = value + ownerTokenTbv.tbv * price;
      ownerTokenTbvMap.set(protocol.id, value);
    });

    setProtocolTbvs(ownerTokenTbvMap);
  }, [testnet, mainnetOwnerTokenTbvs, testnetOwnerTokenTbvs, currentPrices]);

  const isLoading = testnet
    ? (goerliQuery.isLoading || arbitrumGoerliQuery.isLoading)
    : (mainnetQuery.isLoading || arbitrumMainnetQuery.isLoading);

  return {
    protocolTbvs: protocolTbvs,
    isLoading,
  };
}

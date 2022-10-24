import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {useTokens} from "hooks/useTokens";
import {useAtom} from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {
  OwnerTokenTbv,
  useListOwnerTokenTbvsMainnetQuery,
  useListOwnerTokenTbvsTestnetQuery
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
    useListOwnerTokenTbvsTestnetQuery(
      {endpoint: endpoints[1]},
      {},
      {enabled: !!testnet}
    );

  useEffect(() => {
    if (testnet) return;
    if (mainnetData && mainnetData.ownerTokenTbvs) {
      const allOwnerTokens = mainnetData.ownerTokenTbvs;
      // @ts-ignore
      setMainnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [mainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (goerliData && goerliData.ownerTokenTbvs) {
      const allOwnerTokens = goerliData.ownerTokenTbvs;
      // @ts-ignore
      setTestnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [goerliData, testnet]);

  useEffect(() => {
    const ownerTokenTbvMap: Map<string, number> = new Map();
    let selected;
    if (testnet) {
      selected = testnetOwnerTokenTbvs;
    } else  {
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
      value = value + (ownerTokenTbv.tbv * price);
      ownerTokenTbvMap.set(protocol.id, value);
    });

    setProtocolTbvs(ownerTokenTbvMap);
  }, [testnet, mainnetOwnerTokenTbvs, testnetOwnerTokenTbvs, currentPrices]);

  return {
    protocolTbvs: protocolTbvs,
  }
}

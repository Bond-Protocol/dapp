import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import { useTokens } from "hooks/useTokens";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import {
  OwnerTokenTbv,
  useListOwnerTokenTbvsArbitrumGoerliQuery,
  useListOwnerTokenTbvsGoerliQuery,
  useListOwnerTokenTbvsMainnetQuery,
} from "../generated/graphql";
import { useEffect, useState } from "react";
import { getProtocolByAddress } from "@bond-protocol/bond-library";

export function useOwnerTokenTbvs() {
  const endpoints = getSubgraphEndpoints();
  const { getPrice, currentPrices } = useTokens();
  const [testnet] = useAtom(testnetMode);

  const [protocolTbvs, setProtocolTbvs] = useState<Record<string, any>>([]);
  const [mainnetOwnerTokenTbvs, setMainnetOwnerTokenTbvs] = useState<
    OwnerTokenTbv[]
  >([]);
  const [testnetOwnerTokenTbvs, setTestnetOwnerTokenTbvs] = useState<
    OwnerTokenTbv[]
  >([]);

  const { data: mainnetData, ...mainnetQuery } =
    useListOwnerTokenTbvsMainnetQuery(
      { endpoint: endpoints[0] },
      {},
      { enabled: !testnet }
    );

  const { data: goerliData, ...goerliQuery } = useListOwnerTokenTbvsGoerliQuery(
    { endpoint: endpoints[1] },
    {},
    { enabled: !!testnet }
  );

  const { data: arbitrumGoerliData, ...arbitrumGoerliQuery } =
    useListOwnerTokenTbvsArbitrumGoerliQuery(
      { endpoint: endpoints[3] },
      {},
      { enabled: !!testnet }
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
    if (
      goerliData &&
      goerliData.ownerTokenTbvs &&
      arbitrumGoerliData &&
      arbitrumGoerliData.ownerTokenTbvs
    ) {
      const allOwnerTokens = goerliData.ownerTokenTbvs.concat(
        arbitrumGoerliData.ownerTokenTbvs
      );
      // @ts-ignore
      setTestnetOwnerTokenTbvs(allOwnerTokens);
    }
  }, [goerliData, arbitrumGoerliData, testnet]);

  useEffect(() => {
    let selected = testnet ? testnetOwnerTokenTbvs : mainnetOwnerTokenTbvs;

    const updated = selected
      .map((token) => {
        const protocol = getProtocolByAddress(token.owner, token.network);
        if (!protocol) return { id: "", tbv: 0 };

        const price = getPrice(token?.token);
        let value = 0 + parseFloat(token?.tbv) * price;
        return { id: protocol?.id, tbv: value };
      })
      .reduce(
        (elements: Record<string, { id: string; tbv: number }>, current) => {
          const tbv = elements[current.id]?.tbv || 0;
          return {
            ...elements,
            [current.id]: {
              id: current.id,
              tbv: current.tbv + tbv,
            },
          };
        },
        {}
      );

    //@ts-ignore
    setProtocolTbvs(updated);
  }, [testnet, mainnetOwnerTokenTbvs, testnetOwnerTokenTbvs, currentPrices]);

  return {
    protocolTbvs,
  };
}

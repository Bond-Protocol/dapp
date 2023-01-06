import { useListUniqueBondersQuery } from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import { useOwnerTokenTbvs } from "./useOwnerTokenTbvs";
import { usdFormatter } from "src/utils/format";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export const useGlobalMetrics = () => {
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [mainnetUniqueBonders, setMainnetUniqueBonders] = useState(0);
  const [testnetUniqueBonders, setTestnetUniqueBonders] = useState(0);

  const { data: ethMainnetData, ...ethMainnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET] },
    { queryKey: CHAIN_ID.ETHEREUM_MAINNET + "-list-unique-bonders" },
    { enabled: !testnet }
  );

  const { data: ethTestnetData, ...ethTestnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.GOERLI_TESTNET + "-list-unique-bonders" },
    { enabled: !!testnet }
  );

  const { data: arbMainnetData, ...arbMainnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_MAINNET] },
    { queryKey: CHAIN_ID.ARBITRUM_MAINNET + "-list-unique-bonders" },
    { enabled: !testnet }
  );

  const { data: arbTestnetData, ...arbTestnetQuery } = useListUniqueBondersQuery(
    { endpoint: subgraphEndpoints[CHAIN_ID.ARBITRUM_GOERLI_TESTNET] },
    { queryKey: CHAIN_ID.ARBITRUM_GOERLI_TESTNET + "-list-unique-bonders" },
    { enabled: !!testnet }
  );

  useEffect(() => {
    if (testnet) return;
    if (ethMainnetData && ethMainnetData.uniqueBonders && arbMainnetData && arbMainnetData.uniqueBonders) {
      setMainnetUniqueBonders(
        ethMainnetData.uniqueBonders.length +
        arbMainnetData.uniqueBonders.length
      );
    }
  }, [ethMainnetData, arbMainnetData, testnet]);

  useEffect(() => {
    if (!testnet) return;
    if (ethTestnetData && ethTestnetData.uniqueBonders && arbTestnetData && arbTestnetData.uniqueBonders) {
      setTestnetUniqueBonders(
        ethTestnetData.uniqueBonders.length +
        arbTestnetData.uniqueBonders.length
      );
    }
  }, [ethTestnetData, arbTestnetData, testnet]);

  const { protocolTbvs } = useOwnerTokenTbvs();
  const tbv = Object.values(protocolTbvs).reduce(
    (total, { tbv }) => total + tbv,
    0
  );

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    protocolTbvs,
    uniqueBonders: mainnetUniqueBonders,
    uniqueBondersTestnet: testnetUniqueBonders,
  };
};

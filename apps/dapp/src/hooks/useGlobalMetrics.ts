import {
  //useListBondPurchasesQuery,
  useListUniqueBondersGoerliQuery,
  useListUniqueBondersMainnetQuery,
} from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import { useOwnerTokenTbvs } from "./useOwnerTokenTbvs";
import { usdFormatter } from "src/utils/format";

export const useGlobalMetrics = () => {
  const uniqueMainnet = useListUniqueBondersMainnetQuery({
    endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET],
  });

  const uniqueTestnet = useListUniqueBondersGoerliQuery({
    endpoint: subgraphEndpoints[CHAIN_ID.GOERLI_TESTNET],
  });

  // const purchases = useListBondPurchasesQuery({
  //   endpoint: subgraphEndpoints[CHAIN_ID.ETHEREUM_MAINNET],
  // });

  const { protocolTbvs } = useOwnerTokenTbvs();
  const tbv = Object.values(protocolTbvs).reduce(
    (total, { tbv }) => total + tbv,
    0
  );

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    protocolTbvs,
    uniqueBonders: uniqueMainnet.data?.uniqueBonders.length,
    uniqueBondersTestnet: uniqueTestnet.data?.uniqueBonders.length,
  };
};

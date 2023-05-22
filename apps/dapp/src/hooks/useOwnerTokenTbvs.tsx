import { getSubgraphQueries, useTokenLoader } from "services";
import { useTokens } from "hooks/useTokens";
import {
  OwnerTokenTbv,
  useListOwnerTokenTbvsQuery,
} from "../generated/graphql";
import { useEffect, useState } from "react";
import { getProtocolByAddress } from "@bond-protocol/bond-library";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";

export function useOwnerTokenTbvs() {
  const subgraphQueries = getSubgraphQueries(useListOwnerTokenTbvsQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const [isTestnet] = useAtom(testnetMode);
  const [protocolTbvs, setProtocolTbvs] = useState<Record<string, any>>([]);
  const [ownerTokenTbvs, setOwnerTokenTbvs] = useState<OwnerTokenTbv[]>([]);

  useEffect(() => {
    if (isLoading) return;
    setOwnerTokenTbvs(
      concatSubgraphQueryResultArrays(subgraphQueries, "ownerTokenTbvs")
    );
  }, [isLoading, isTestnet]);

  useEffect(() => {
    // const updated = ownerTokenTbvs
    //   .map((token) => {
    //     const protocol = getProtocolByAddress(token.owner, token.chainId);
    //     if (!protocol) return { id: "", tbv: 0 };
    //     const price = getPrice(token.address);
    //     let value = 0 + parseFloat(token?.tbv) * price;
    //     let tbv = isNaN(value) ? 0 : value;
    //     return { id: protocol?.id, tbv };
    //   })
    //   .reduce(
    //     (elements: Record<string, { id: string; tbv: number }>, current) => {
    //       const tbv = elements[current.id]?.tbv || 0;
    //       return {
    //         ...elements,
    //         [current.id]: {
    //           id: current.id,
    //           tbv: isNaN(tbv) ? current.tbv : current.tbv + tbv,
    //         },
    //       };
    //     },
    //     {}
    //   );
    // setProtocolTbvs(updated);
  }, [ownerTokenTbvs]);

  return {
    isLoading,
    protocolTbvs: 0,
  };
}

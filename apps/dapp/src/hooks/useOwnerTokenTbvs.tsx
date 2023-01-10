import { getSubgraphQueries } from "services/subgraph-endpoints";
import { useTokens } from "hooks/useTokens";
import {
  OwnerTokenTbv,
  useListOwnerTokenTbvsQuery,
} from "../generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { getProtocolByAddress } from "@bond-protocol/bond-library";

export function useOwnerTokenTbvs() {
  const subgraphQueries = getSubgraphQueries(useListOwnerTokenTbvsQuery);

  const { currentPrices, getPrice } = useTokens();

  const [protocolTbvs, setProtocolTbvs] = useState<Record<string, any>>([]);
  const [ownerTokenTbvs, setOwnerTokenTbvs] = useState<OwnerTokenTbv[]>([]);

  const isLoading = useMemo(() => {
    return subgraphQueries
      .map((value) => value.isLoading)
      .reduce((previous, current) => previous || current);
  }, [subgraphQueries]);

  useEffect(() => {
    if (isLoading) return;

    setOwnerTokenTbvs(
      subgraphQueries
        .map((value) => value.data.ownerTokenTbvs)
        .reduce((previous, current) => previous.concat(current))
    );
  }, [isLoading]);

  useEffect(() => {
    const updated = ownerTokenTbvs
      .map((token) => {
        const protocol = getProtocolByAddress(token.owner, token.chainId);
        if (!protocol) return { id: "", tbv: 0 };

        const price = getPrice(token?.token);
        let value = 0 + parseFloat(token?.tbv) * price;
        let tbv = isNaN(value) ? 0 : value;
        return { id: protocol?.id, tbv };
      })
      .reduce(
        (elements: Record<string, { id: string; tbv: number }>, current) => {
          const tbv = elements[current.id]?.tbv || 0;
          return {
            ...elements,
            [current.id]: {
              id: current.id,
              tbv: isNaN(tbv) ? current.tbv : current.tbv + tbv,
            },
          };
        },
        {}
      );

    setProtocolTbvs(updated);
  }, [ownerTokenTbvs, currentPrices]);

  return {
    isLoading,
    protocolTbvs,
  };
}

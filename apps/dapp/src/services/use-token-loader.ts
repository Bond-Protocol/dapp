import { useEffect, useState } from "react";
import { useQueries } from "react-query";
import { tokenlist } from "@bond-protocol/bond-library";
import { Token } from "@bond-protocol/contract-library";
import * as defillama from "./defillama";
import { currentEndpoints } from "./subgraph-endpoints";
import { generateGraphqlQuery } from "./custom-queries";

const fetchPrices = async (tokens: Token[]) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens
    .map((t: any) => ({
      ...t,
      price: prices.find((p: any) => p.address === t.address)?.price,
    }))
    .filter((t: any) => !!t.price);
};

const listQuery = `query ListTokens { tokens { address chainId name decimals symbol } }`;

/**
 *
 */
export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const queries = useQueries(
    currentEndpoints.map((e) => {
      return {
        queryKey: `list-all-tokens-${e.chain}`,
        queryFn: generateGraphqlQuery(listQuery, e.url),
      };
    })
  );

  const isAnyLoading = queries.some((q) => q.isLoading);

  useEffect(() => {
    const loadPrices = async () => {
      const tokens = queries
        .flatMap((q) => q.data.data.tokens)
        .map((t) => ({
          ...t,
          logoUrl: tokenlist.find(
            (tok) => tok.address === t.address.toLowerCase()
          )?.logoURI,
        }));

      const pricedTokens = await fetchPrices(tokens);

      setTokens(pricedTokens);
    };

    loadPrices();
  }, [isAnyLoading]);

  return { tokens };
};

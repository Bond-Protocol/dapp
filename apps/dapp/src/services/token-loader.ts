import { useEffect, useState } from "react";
import { useQuery } from "wagmi";
import { fetchAndParseTokenList } from "./token-list";
import * as defillama from "./defillama";
import { tokenlist } from "@bond-protocol/bond-library";

const fetchPrices = async (tokens: any[]) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  // const unwrapped = defillama.utils.unwrapPrices(prices?.coins);

  //Adds the price to previously fetched tokens
  return tokens
    .map((t: any) => ({
      ...t,
      price: prices.find((p: any) => p.address === t.address)?.price,
    }))
    .filter((t: any) => !!t.price);
};

export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<any[]>([]);

  const query = useQuery(["DEFAULT_TOKEN_LIST"], () =>
    fetchAndParseTokenList()
  );

  useEffect(() => {}, [tokens]);

  /** Loads token Prices */
  useEffect(() => {
    const loadPrices = async () => {
      // Get chain:address string to query defillama
      const pricedTokens = await fetchPrices(tokenlist);
      setTokens(pricedTokens);
    };

    loadPrices();
  }, [query.isFetched]);

  return { tokens: query.data ?? [], pricedTokens: tokens };
};

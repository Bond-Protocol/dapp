import { useEffect, useState } from "react";
import { useQuery } from "wagmi";
import { fetchAndParseTokenList } from "./token-list";
import * as defillama from "./defillama";
import { tokenlist } from "@bond-protocol/bond-library";

const fetchPrices = async (tokens: any[]) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

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
  const [tokenlists, setTokenlists] = useState<any>({});

  const query = useQuery(
    ["DEFAULT_TOKEN_LIST"],
    () => fetchAndParseTokenList(),
    { enabled: false }
  );

  /** Loads token Prices */
  useEffect(() => {
    const loadPrices = async () => {
      const pricedTokens = await fetchPrices(tokenlist);

      setTokens(pricedTokens);
    };

    loadPrices();
  }, []);

  return { tokens, tokenlists };
};

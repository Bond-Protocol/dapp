import { useEffect, useState } from "react";
import { useQuery } from "wagmi";
import { tokenlist } from "@bond-protocol/bond-library";
import { Token } from "@bond-protocol/contract-library";
import { fetchAndParseTokenList } from "./token-list";
import { fetchPrices } from "./use-token-loader";

export const useTokenlistLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

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

  return { tokens };
};

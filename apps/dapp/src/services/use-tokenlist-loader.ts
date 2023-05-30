import { useEffect, useState } from "react";
import { tokenlist } from "hooks";
import { Token } from "@bond-protocol/contract-library";
import { fetchPrices } from "./use-token-loader";

export const useTokenlistLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const pricedTokens = await fetchPrices(tokenlist);

        setTokens(pricedTokens);
      } catch (e) {
        console.log("Failed to fetch prices for default tokenlist", e);
      }
    };

    loadPrices();
  }, []);

  const addToken = (token: Token) => {
    setTokens([...tokens, token]);
  };

  return { tokens, addToken };
};

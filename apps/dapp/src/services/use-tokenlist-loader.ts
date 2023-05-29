import { useEffect, useState } from "react";
import { tokenlist } from "@bond-protocol/bond-library";
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
    console.log("add tokens", token);
  };

  console.log("loader-hook", { tokens });
  return { tokens, addToken };
};

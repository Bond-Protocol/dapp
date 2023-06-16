import { useEffect, useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import { testnetTokenlist, tokenlist } from "hooks";
import * as defillama from "./defillama";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { environment } from "src/environment";

export const fetchPrices = async (tokens: Array<Omit<Token, "price">>) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens.map((t: any) => ({
    ...t,
    chainId: Number(t.chainId),
    // @ts-ignore
    price: prices.find((p: any) => p.address === t.address)?.price ?? 0,
  }));
};

export const fetchAndMatchPricesForTestnet = async () => {
  const pricedTokens = await fetchPrices(tokenlist);

  return testnetTokenlist.map((t) => {
    const price = pricedTokens.find(
      (pt) => t.symbol.toLowerCase() === pt?.symbol?.toLowerCase()
    )?.price;

    return { ...t, price };
  });
};

/**
 *
 */
export const useTokenlistLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const { discoverFromApi } = useDiscoverToken();
  const [fetchedExtendedDetails, setFetchExtended] = useState(false);

  const getByAddress = (address: string) => {
    return tokens.find(
      (t) => t.address.toLowerCase() === address?.toLowerCase()
    );
  };

  const getByChain = (chainId: number) =>
    tokens.filter((t) => t.chainId === chainId);

  const addToken = (token: Token) => {
    setUserTokens((prev) => [...prev, token]);
  };

  useEffect(() => {
    const loadPrices = async () => {
      const tokens = tokenlist.filter((t) => t.display === true);

      const pricedTokens = environment.isTestnet
        ? await fetchAndMatchPricesForTestnet()
        : await fetchPrices(tokens);

      setTokens(pricedTokens);
      setFetchExtended(false);
    };

    loadPrices();
  }, []);

  useEffect(() => {
    async function fetchExtendedDetails() {
      if (Boolean(tokens.length) && !fetchedExtendedDetails) {
        const updatedTokens = await discoverFromApi(tokens);
        setFetchExtended(true);
        setTokens(updatedTokens);
      }
    }

    fetchExtendedDetails();
  }, [tokens]);

  return {
    tokens: [...tokens, ...userTokens],
    getByAddress,
    getByChain,
    addToken,
    fetchedExtendedDetails,
  };
};

import { useEffect, useState } from "react";
import { generateFetcher } from "./custom-queries";
import { activeChains } from "context/evm-provider";
import { fetchMultiple } from "./defillama";
import { useQuery } from "wagmi";

const DEFAULT_SUPPORTED_CHAINS = [42161];
const DEFAULT_TOKEN_LIST_URL =
  "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

const fetchAndParseTokenList = async (
  url: string,
  supportedChains = DEFAULT_SUPPORTED_CHAINS
) => {
  const fetchCustomList = generateFetcher(url);

  try {
    const response = await fetchCustomList();
    return response?.tokens
      .filter((t: any) => supportedChains.includes(t.chainId))
      .map((t: any) => ({ ...t, logoUrl: t?.logoURI }));
  } catch (e) {
    console.error(`Something went wrong fetching ${url}`, e);
  }
};

const toDefillamaQueryId = (t: any) => {
  const chain = activeChains.find((c) => c.id === t.chainId);
  const name = chain?.name.split(" ")[0] ?? ""; // The api supports 'arbitrum' instead of 'arbitrum-one' :pepe_angry_sip:
  return `${name.toLowerCase()}:${t.address}`;
};

export const useTokenLoader = () => {
  const query = useQuery(["DEFAULT_TOKEN_LIST"], () =>
    fetchAndParseTokenList(DEFAULT_TOKEN_LIST_URL)
  );

  /** Loads token Prices */
  useEffect(() => {
    const loadPrices = async () => {
      if (query.isFetched) {
        const addresses = query.data.map(toDefillamaQueryId);

        const prices = await fetchMultiple(addresses);
        console.log({ prices });
      }
    };

    loadPrices();
  }, [query.isFetched]);

  return { tokens: query.data ?? [] };
};

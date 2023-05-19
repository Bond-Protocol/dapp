import { useEffect, useState } from "react";
import { useQuery } from "wagmi";
import { fetchAndParseTokenList } from "./token-list";
import * as defillama from "./defillama";

export const useTokenLoader = () => {
  const [tokens, setTokens] = useState([]);
  const query = useQuery(["DEFAULT_TOKEN_LIST"], () =>
    fetchAndParseTokenList()
  );

  /** Loads token Prices */
  useEffect(() => {
    const loadPrices = async () => {
      if (query.isFetched) {
        // Get chain:address string to query defillama
        const addresses = query.data.map(defillama.utils.toDefillamaQueryId);

        const prices = await defillama.fetchPrice(addresses);
        console.log({ prices });

        // const unwrapped = defillama.utils.unwrapPrices(prices?.coins);

        //Adds the price to previously fetched tokens
        const pricedTokens = query.data
          .map((t: any) => ({
            ...t,
            price: prices.find((p: any) => p.address === t.address)?.price,
          }))
          .filter((t: any) => !!t.price);

        setTokens(pricedTokens);
      }
    };

    loadPrices();
  }, [query.isFetched]);

  return { tokens: query.data ?? [], pricedTokens: tokens };
};

import { useQuery } from "react-query";
import { TOKENS } from "@bond-protocol/bond-library";
import type { CustomPriceSource, Token } from "@bond-protocol/bond-library";
import { providers } from "services";

/*
  Loads custom price data. As these may be from varying sources, it is the responsibility of the customPriceFunction
  defined on the Token in the bond-library to ensure these requests return a price string on success.
*/
export const useLoadCustomPriceFunctions = () => {
  return useQuery("customPriceData", async () => {
    const requests: Set<Promise<string>> = new Set();
    const functions: Map<() => Promise<string>, string[]> = new Map();

    const pricesMap = new Map();

    TOKENS?.forEach((token: Token, key: string) => {
      token.priceSources?.forEach((priceSource: any | CustomPriceSource) => {
        if (priceSource.source === "custom") {
          /*
            Tokens can be present on multiple chains, and thus have differing ids in our library and subgraph.
            To avoid making a custom price request for each instance of the token, we use a map with the function
            as the key, and a list of token IDs which use this function as the value.

            First, we get an array of Token IDs which use this function, or an empty array if there are none.
           */
          const tokenIds =
            functions.get(priceSource?.customPriceFunction) || [];

          // If this function hasn't been added already, add it to the requests Set
          if (tokenIds.length === 0) {
            const provider =
              priceSource.providerChainId != undefined
                ? providers[priceSource.providerChainId]
                : undefined;

            requests.add(
              priceSource
                .customPriceFunction(provider)
                .then((result: string) => {
                  // When the request resolves, store the price in the pricesMap,
                  // using the priceSource as the key and the result (price) as the value.
                  tokenIds?.forEach((priceSource: string) => {
                    pricesMap.set(priceSource, result);
                  });
                  return result;
                })
            );
          }

          // Add the current Token ID to the array and set it as the value for this function's key.
          tokenIds.push(key);
          functions.set(priceSource.customPriceFunction, tokenIds);
        }
      });
    });

    // When all the Promises have settled, return the pricesMap, which was populated by each request's 'then' callback.
    return Promise.allSettled(requests).then(() => pricesMap);
  });
};

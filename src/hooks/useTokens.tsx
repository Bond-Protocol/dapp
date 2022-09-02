import * as contractLibrary from "@bond-labs/contract-library";
import { providers } from "services/owned-providers";
import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {
  Token,
  useListTokensGoerliQuery,
  useListTokensRinkebyQuery,
} from "../generated/graphql";
import { useEffect, useCallback, useState } from "react";
import * as bondLibrary from "@bond-labs/bond-library";
import {
  CustomPriceSource,
  SupportedPriceSource,
} from "@bond-labs/bond-library";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import testnetMode from "../atoms/testnetMode.atom";

export interface PriceDetails {
  price: string;
  source: string;
}

export interface Price {
  [key: string]: PriceDetails;
}

export const useTokens = () => {
  const endpoints = getSubgraphEndpoints();
  const [testnet, setTestnet] = useAtom(testnetMode);
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);
  const [mainnetTokens, setMainnetTokens] = useState<Token[]>([]);
  const [testnetTokens, setTestnetTokens] = useState<Token[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Price>({});

  /*
  Tokens can be present on multiple chains, and thus have differing ids in our library and subgraph.
  However, they share price API ids, so this convenience function provides a Set with no duplicates.
   */
  const apiIds = bondLibrary.getUniqueApiIds();

  /*
  Load the data from the subgraph.
  Unfortunately we currently need a separate endpoint for each chain, and a separate set of GraphQL queries for each chain.
   */
  const { data: rinkebyData } = useListTokensRinkebyQuery({
    endpoint: endpoints[0],
  });
  const { data: goerliData } = useListTokensGoerliQuery({
    endpoint: endpoints[1],
  });

  /*
  Loads token price data from Coingecko.
   */
  const coingeckoQuery = useQuery("coingeckoData", async () => {
    const tokenIds = [...apiIds.coingecko].join(",");
    try {
      return axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
        )
        .then((response: AxiosResponse) => response.data);
    } catch (e: any) {
      throw new Error("Coingecko API error" + e);
    }
  });

  /*
  Loads custom price data. As these may be from varying sources, it is the responsibility of the customPriceFunction
  defined on the Token in the bond-library to ensure these requests return a price string on success.
   */
  const customPriceQuery = useQuery("customPriceData", async () => {
    const requests: Set<Promise<string>> = new Set();
    const functions: Map<() => Promise<string>, string[]> = new Map();
    const pricesMap = new Map();
    try {
      bondLibrary.TOKENS.forEach((token: bondLibrary.Token, key: string) => {
        token.priceSources.forEach((priceSource: any | CustomPriceSource) => {
          if (priceSource.source === "custom") {
            /*
            Tokens can be present on multiple chains, and thus have differing ids in our library and subgraph.
            To avoid making a custom price request for each instance of the token, we use a map with the function
            as the key, and a list of token IDs which use this function as the value.

            First, we get an array of Token IDs which use this function, or an empty array if there are none.
           */
            const tokenIds =
              functions.get(priceSource.customPriceFunction) || [];

            // If this function hasn't been added already, add it to the requests Set
            if (tokenIds.length === 0) {
              requests.add(
                priceSource.customPriceFunction().then((result: string) => {
                  // When the request resolves, store the price in the pricesMap,
                  // using the priceSource as the key and the result (price) as the value.
                  tokenIds.forEach((priceSource: string) => {
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
    } catch (e: any) {
      throw new Error("Error loading custom prices", e);
    }

    // When all the Promises have settled, return the pricesMap, which was populated by each request's 'then' callback.
    return Promise.allSettled(requests).then(() => pricesMap);
  });

  /*
  When all the price data has been loaded, we can populate the currentPricesMap which this hook will make available.
  The map uses Token ID as the key, and an array of Price objects as the value.

  The Price array is ordered by priority, based on the PriceSource's key as set in the bond-library.
  For example, if the Coingecko price has key 0 and the Nomics price has key 1 in the bond-library's Token.priceSources
  map, then the Coingecko price will be put in prices[0] and the Nomics price in prices[1].

  The Coingecko price will therefore be the default, Nomics the fallback.
  */
  useEffect(() => {
    if (coingeckoQuery.data && customPriceQuery.data) {
      const currentPricesMap: Price = {};

      bondLibrary.TOKENS.forEach(
        (value: bondLibrary.Token, tokenKey: string) => {
          const prices: PriceDetails[] = [];
          value.priceSources.forEach(
            (
              priceSource: SupportedPriceSource | CustomPriceSource,
              priority: number
            ) => {
              // First, we get the price from the appropriate query data, according to the PriceSource's source field.
              let price;
              switch (priceSource.source) {
                case "coingecko":
                  price =
                    coingeckoQuery.data[priceSource.apiId] &&
                    coingeckoQuery.data[priceSource.apiId].usd;
                  break;
                case "custom":
                  price = customPriceQuery.data.get(tokenKey);
                  break;
              }
              // Then, we insert it into the prices array, at position [priority],
              // where priority is the PriceSource's key in the Token.priceSources map.
              prices[priority] = {
                price: price,
                source: priceSource.source,
              };
            }
          );
          currentPricesMap[tokenKey] = prices;
        }
      );

      setCurrentPrices(currentPricesMap);
    }
  }, [coingeckoQuery.data, customPriceQuery.data]);

  /*
  We get a list of all tokens being used in the app by concatenating the .tokens data from each Subgraph request.
   */
  useEffect(() => {
    if (rinkebyData && rinkebyData.tokens && goerliData && goerliData.tokens) {
      const allTokens = rinkebyData.tokens.concat(goerliData.tokens);
      // @ts-ignore
      setTestnetTokens(allTokens);
    }
  }, [rinkebyData, goerliData]);

  /*
  If the user switches between mainnet/testnet mode, update selectedTokens.
   */
  useEffect(() => {
    if (testnet) {
      setSelectedTokens(testnetTokens);
    } else {
      setSelectedTokens(mainnetTokens);
    }
  }, [testnet, mainnetTokens, testnetTokens]);

  function getPrice(id: string): number {
    const sources = currentPrices[id];
    if (!sources) return 0;
    for (const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return Number(source.price);
    }
    return 0;
  }

  function getTokenDetails(token: any) {
    const bondLibraryToken = bondLibrary.TOKENS.get(token.id);
    return {
      id: token.id,
      address: token.address,
      network: token.network,
      name: bondLibraryToken ? bondLibraryToken.name : token.name,
      symbol: bondLibraryToken ? bondLibraryToken.symbol : token.symbol,
      decimals: token.decimals,
    };
  }

  const getTokenDetailsFromChain = useCallback(async function (
    address: string,
    chain: string
  ) {
    const contract = contractLibrary.IERC20__factory.connect(
      address,
      providers[chain]
    );
    try {
      const [name, symbol] = await Promise.all([
        contract.name(),
        contract.symbol(),
      ]);

      return { name, symbol };
    } catch (e: any) {
      const error =
        "Not an ERC-20 token, please double check the address and chain.";
      throw Error(error);
    }
  },
  []);

  /*
  tokens:         An array of all Tokens the Subgraph has picked up on mainnet networks
  currentPrices:  A map with Token ID as key and an array of Price objects ordered by priority as value
   */
  return {
    tokens: selectedTokens,
    currentPrices: currentPrices,
    getPrice: (id: string) => getPrice(id),
    getTokenDetails: (token: any) => getTokenDetails(token),
    getTokenDetailsFromChain,
  };
};

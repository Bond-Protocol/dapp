import { useEffect, useState } from "react";
import * as contractLibrary from "@bond-protocol/contract-library";
import * as bondLibrary from "@bond-protocol/bond-library";
import type {
  CustomPriceSource,
  SupportedPriceSource,
} from "@bond-protocol/bond-library";
import { Token, useListTokensQuery } from "../generated/graphql";
import { providers, getSubgraphQueries } from "services";
import { concatSubgraphQueryResultArrays } from "../utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "hooks/useSubgraphLoadingCheck";
import { environment } from "src/environment";
import { useMultipleTokensFromCoingecko } from "./useCoingecko";
import { useLoadCustomPriceFunctions } from "./useLoadCustomPriceFunctions";
import { getTokenDetails } from "src/utils";

export interface PriceDetails {
  price: string;
  source: string;
}

export type Price = Record<string, PriceDetails>;

type BondLibraryToken = bondLibrary.Token & { key: string };

const allTokens: Array<BondLibraryToken> = Array.from(
  bondLibrary.TOKENS.keys()
).filter((key) => {
    const split: string[] = key.split("_");
    let chainId = split[0];
    return providers[chainId] != undefined;
  }
).map((key) => ({
  ...bondLibrary.TOKENS.get(key)!,
  key,
}));

const baseTokens = allTokens.filter((t) => !("lpType" in t));
const lpTokens = allTokens
  .filter((t) => "lpType" in t)
  .map((t) => ({ value: t, key: t.key }));

const isTestnet = environment.isTestnet;

export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Price>({});

  const subgraphQueries = getSubgraphQueries(useListTokensQuery);
  const { isLoading } = useSubgraphLoadingCheck(subgraphQueries);

  const coingeckoQuery = useMultipleTokensFromCoingecko();
  const customPriceQuery = useLoadCustomPriceFunctions();

  const mapBaseTokenPrices = () => {
    return baseTokens.reduce((currentPrices, value) => {
      let prices: Record<number, any> = [];
      value.priceSources?.forEach(
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
              price = customPriceQuery.data?.get(value.key);
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
      return { ...currentPrices, [value.key]: prices };
    }, {});
  };

  const mapLpTokenPrices = async (
    baseTokens: Record<string, BondLibraryToken>
  ) => {
    const promises = lpTokens.map((token) => {
      //@ts-ignore
      if (token.value?.lpType === undefined) return;

      const split: string[] = token.key.split("_");
      let chainId = split[0];

      //this be the correct function to call depending on the LP type
      let handler: () => unknown;

      //Find the correct type of LP
      if ("poolAddress" in token.value) {
        //@ts-ignore
        token.value.constituentTokens.forEach((token) => {
          //@ts-ignore
          token.price = baseTokens[chainId + "_" + token.address.toLowerCase()]
            ? Number(
              // @ts-ignore
              baseTokens[chainId + "_" + token.address.toLowerCase()][0].price
            )
            : undefined;
        });

        const balancerToken = {
          //@ts-ignore
          poolAddress: token.value.poolAddress,
          //@ts-ignore
          vaultAddress: token.value.vaultAddress,
          //@ts-ignore
          constituentTokens: token.value.constituentTokens,
        };

        handler = () =>
          //@ts-ignore
          contractLibrary.calcBalancerPoolPrice(
            //@ts-ignore
            balancerToken,
            providers[chainId]
          );
      } else {
        //##
        //##
        //@ts-ignore
        const lpType = bondLibrary.LP_TYPES.get(token.value.lpType);

        //TODO: (aphex) patched this manually due to library fixes, should be made consistent
        //@ts-ignore
        let token0Address = token.value.token0Address;
        //@ts-ignore
        let token1Address = token.value.token1Address;

        if (token0Address.indexOf("_") === -1)
          token0Address = chainId + "_" + token0Address;
        if (token1Address.indexOf("_") === -1)
          token1Address = chainId + "_" + token1Address;

        //@ts-ignore
        token.value["token0"] = bondLibrary.getTokenByAddress(token0Address);

        //@ts-ignore
        token.value["token1"] = bondLibrary.getTokenByAddress(token1Address);

        //@ts-ignore
        const t0 = baseTokens[token0Address];
        //@ts-ignore
        const t1 = baseTokens[token1Address];

        //@ts-ignore
        token.value["token0"].price = t0 && t0[0]?.price;
        //@ts-ignore
        token.value["token1"].price = t1 && t1[0]?.price;

        handler = () =>
          contractLibrary.calcLpPrice(
            {
              // @ts-ignore
              lpPair: { ...token.value, address: split[1] },
              address: split[1],
            },
            lpType,
            providers[chainId]
          );
      }

      //@ts-ignore
      //Now call the price handler and format the result
      return handler().then((result) => {
        const prices = [{ price: result, source: "custom" }];
        return { key: token.key, prices };
      });
    });

    const result = await Promise.allSettled(promises);
    return (
      result
        //@ts-ignore
        .map((query) => query.value)
        .reduce((prices, token) => {
          return { ...prices, [token && token.key]: token && token.prices };
        }, {})
    );
  };

  /*
  When all the price data has been loaded, we can populate the currentPricesMap which this hook will make available.
  The map uses Token ID as the key, and an array of Price objects as the value.

  The Price array is ordered by priority, based on the PriceSource's key as set in the bond-library.
  For example, if the Coingecko price has key 0 and the Nomics price has key 1 in the bond-library's Token.priceSources
  map, then the Coingecko price will be put in prices[0] and the Nomics price in prices[1].

  The Coingecko price will therefore be the default, Nomics the fallback.
  */
  useEffect(() => {
    const hasPrices = Object.keys(currentPrices).length > 0;
    if (coingeckoQuery.data && customPriceQuery.data && !hasPrices) {
      setupPrices();
    }

    async function setupPrices() {
      const baseTokenPrices = mapBaseTokenPrices();
      const lpTokenPrices = await mapLpTokenPrices(baseTokenPrices);
      setCurrentPrices({ ...baseTokenPrices, ...lpTokenPrices });
    }
  }, [tokens, coingeckoQuery.data, customPriceQuery.data]);

  /*
  We get a list of all tokens being used in the app by concatenating the .tokens data from each Subgraph request.
   */
  useEffect(() => {
    if (isLoading) return;
    setTokens(concatSubgraphQueryResultArrays(subgraphQueries, "tokens"));
  }, [isLoading, isTestnet]);

  function getPrice(id: string): number {
    const sources = currentPrices[id.toLowerCase()];
    if (!sources) return 0;
    // @ts-ignore
    for (const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return Number(source.price);
    }
    return 0;
  }

  /*
  tokens:         An array of all Tokens the Subgraph has picked up on mainnet networks
  currentPrices:  A map with Token ID as key and an array of Price objects ordered by priority as value
   */
  return {
    tokens,
    currentPrices,
    getPrice,
    getTokenDetails,
    isLoading: false,
  };
};

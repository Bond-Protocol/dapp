import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Token, useListTokensGoerliQuery, useListTokensRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";
import * as bondLibrary from "@bond-labs/bond-library";
import {CustomPriceSource, SupportedPriceSource} from "@bond-labs/bond-library";
import axios, {AxiosResponse} from "axios";
import {useQuery} from "react-query";

export function useTokens() {
  const endpoints = getSubgraphEndpoints();

  const [mainnet, setMainnet] = useState<Token[]>([]);
  const [testnet, setTestnet] = useState<Token[]>([]);
  const [currentPrices, setCurrentPrices] = useState(new Map());

  const apiIds = bondLibrary.getUniqueApiIds();

  const {data: rinkebyData} = useListTokensRinkebyQuery({
    endpoint: endpoints[0],
  });

  const {data: goerliData} = useListTokensGoerliQuery({
    endpoint: endpoints[1],
  });

  const coingeckoQuery = useQuery("coingeckoData", async () => {
    const tokenIds = [...apiIds.coingecko].join(",");
    try {
      return axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
      ).then((response: AxiosResponse) => response.data);
    } catch (e: any) {
      throw new Error("Coingecko API error" + e);
    }
  });

  const nomicsQuery = useQuery("nomicsData", async () => {
    const apiKey: string = import.meta.env.VITE_NOMICS_API_KEY;
    const tokenIds = [...apiIds.nomics].join(",");
    try {
      return axios.get(
        `https://api.nomics.com/v1/currencies/ticker?ids=${tokenIds}&key=${apiKey}`
      ).then((response: AxiosResponse) => {
        return response.data.reduce(function (result: Map<string, string>, item: { id: string, price: string }) {
          return result.set(item.id, item.price);
        }, new Map());
      });
    } catch (e: any) {
      throw new Error("Nomics API error", e);
    }
  });

  const customPriceQuery = useQuery("customPriceData", async () => {
    const requests: Set<Promise<string>> = new Set();
    const functions: Map<() => Promise<string>, string[]> = new Map();
    const pricesMap = new Map();
    try {
      bondLibrary.TOKENS.forEach((value: bondLibrary.Token, key: string) => {
        if (value.customPriceFunction != undefined) {
          const currentValue = functions.get(value.customPriceFunction) || [];

          if (currentValue.length === 0) {
            value.customPriceFunction &&
            requests.add(
              value.customPriceFunction().then((result: string) => {
                currentValue.forEach((value: string) => {
                  pricesMap.set(value, result);
                });
                return result;
              })
            );
          }

          currentValue.push(key);
          value.customPriceFunction &&
          functions.set(value.customPriceFunction, currentValue);
        }
      });
    } catch (e: any) {
      throw new Error("Error loading custom prices", e);
    }

    return Promise.all(requests).then(() => pricesMap);
  });

  useEffect(() => {
    if (coingeckoQuery.data && nomicsQuery.data && customPriceQuery.data) {
      const currentPricesMap = new Map();
      const coingeckoPricesMap = new Map();
      const nomicsPricesMap = new Map();

      bondLibrary.TOKENS.forEach((value: bondLibrary.Token, tokenKey: string) => {
        const prices: { price: string, source: string }[] = [];
        value.priceSources.forEach((priceSource: SupportedPriceSource | CustomPriceSource, priority: number) => {
          let price;
          switch (priceSource.source) {
          case "coingecko":
            price = coingeckoQuery.data[priceSource.apiId] && coingeckoQuery.data[priceSource.apiId].usd;
            coingeckoPricesMap.set(tokenKey, price);
            break;
          case "nomics":
            price = nomicsQuery.data.get(priceSource.apiId);
            nomicsPricesMap.set(tokenKey, price);
            break;
          case "custom":
            price = customPriceQuery.data.get(tokenKey);
            break;
          }
          prices[priority] = {
            price: price,
            source: priceSource.source
          };
        });
        currentPricesMap.set(tokenKey, prices);
      });

      setCurrentPrices(currentPricesMap);
    }
  }, [coingeckoQuery.data, nomicsQuery.data, customPriceQuery.data]);

  useEffect(() => {
    if (rinkebyData && rinkebyData.tokens && goerliData && goerliData.tokens) {
      const allMarkets = rinkebyData.tokens.concat(goerliData.tokens);
      // @ts-ignore
      setTestnet(allMarkets);
    }
  }, [rinkebyData, goerliData]);

  return {
    mainnet: mainnet,
    testnet: testnet,
    currentPrices: currentPrices,
  };
}

import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Token, useListTokensGoerliQuery, useListTokensRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";
import * as bondLibrary from "@bond-labs/bond-library";
import {CustomPriceSource, SupportedPriceSource} from "@bond-labs/bond-library";
import axios, {AxiosResponse} from "axios";

export function useTokens() {
  const endpoints = getSubgraphEndpoints();

  const [mainnet, setMainnet] = useState<Token[]>([]);
  const [testnet, setTestnet] = useState<Token[]>([]);
  const [currentPrices, setCurrentPrices] = useState(new Map());
  const [customPriceData, setCustomPriceData] = useState(new Map());
  const [coingeckoData, setCoingeckoData] = useState(null);
  const [nomicsData, setNomicsData] = useState(null);

  const apiIds = bondLibrary.getUniqueApiIds();

  const {data: rinkebyData} = useListTokensRinkebyQuery({
    endpoint: endpoints[0],
  });

  const {data: goerliData} = useListTokensGoerliQuery({
    endpoint: endpoints[1],
  });

  async function getCoingeckoData() {
    console.log("cdc");
    const tokenIds = [...apiIds.coingecko].join(",");
    let resp: AxiosResponse;

    try {
      resp = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
      );

      setCoingeckoData(resp.data);
    } catch (e) {
      console.log("coingecko api error: ", e);
    }
  }

  async function getNomicsData() {
    const apiKey: string = import.meta.env.VITE_NOMICS_API_KEY;
    const tokenIds = [...apiIds.nomics].join(",");
    let resp: AxiosResponse;
    try {
      resp = await axios.get(
        `https://api.nomics.com/v1/currencies/ticker?ids=${tokenIds}&key=${apiKey}`
      );
      const nomicsMap = resp.data.reduce(function (result: Map<string, string>, item: { id: string, price: string }) {
        return result.set(item.id, item.price);
      }, new Map());

      setNomicsData(nomicsMap);
    } catch (e) {
      console.log("Nomics API error: ", e);
    }
  }

  async function getCustomPrices() {
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
    } catch (e) {
      console.log("Error loading custom prices: ", e);
    }

    await Promise.all(requests);
    setCustomPriceData(pricesMap);
  }

  useEffect(() => {
    if (coingeckoData && nomicsData && customPriceData) {
      const currentPricesMap = new Map();
      const coingeckoPricesMap = new Map();
      const nomicsPricesMap = new Map();

      bondLibrary.TOKENS.forEach((value: bondLibrary.Token, tokenKey: string) => {
        const prices: { price: string, source: string }[] = [];
        value.priceSources.forEach((priceSource: SupportedPriceSource | CustomPriceSource, priority: number) => {
          let price;
          switch (priceSource.source) {
          case "coingecko":
            price = coingeckoData[priceSource.apiId] && coingeckoData[priceSource.apiId].usd;
            coingeckoPricesMap.set(tokenKey, price);
            break;
          case "nomics":
            price = nomicsData.get(priceSource.apiId);
            nomicsPricesMap.set(tokenKey, price);
            break;
          case "custom":
            price = customPriceData.get(tokenKey);
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
  }, [coingeckoData, nomicsData, customPriceData]);

  useEffect(() => {
    if (rinkebyData && rinkebyData.tokens && goerliData && goerliData.tokens) {
      const allMarkets = rinkebyData.tokens.concat(goerliData.tokens);
      // @ts-ignore
      setTestnet(allMarkets);
      void getCoingeckoData();
      void getNomicsData();
      void getCustomPrices();
    }
  }, [rinkebyData, goerliData]);

  return {
    mainnet: mainnet,
    testnet: testnet,
    customPrices: customPriceData,
    currentPrices: currentPrices,
  };
}

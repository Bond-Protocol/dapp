import { getSubgraphEndpoints } from "services/subgraph-endpoints";
import {
  Token,
  useListTokensGoerliQuery,
  useListTokensRinkebyQuery,
} from "../generated/graphql";
import { useEffect, useState } from "react";
import * as bondLibrary from "@bond-labs/bond-library";
import axios from "axios";

export function useTokens() {
  const endpoints = getSubgraphEndpoints();

  const [mainnet, setMainnet] = useState<Token[]>([]);
  const [testnet, setTestnet] = useState<Token[]>([]);
  const [coingeckoPrices, setCoingeckoPrices] = useState(new Map());
  const [nomicsPrices, setNomicsPrices] = useState(new Map());
  const [customPrices, setCustomPrices] = useState(new Map());
  const apiIds = bondLibrary.getUniqueApiIds();

  const { data: rinkebyData } = useListTokensRinkebyQuery({
    endpoint: endpoints[0],
  });

  const { data: goerliData } = useListTokensGoerliQuery({
    endpoint: endpoints[1],
  });

  async function getCoingeckoPrices() {
    let tokenIds = [...apiIds.coingecko].join(",");
    let resp: any;

    try {
      resp = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
      );
      const pricesMap = new Map();
      bondLibrary.TOKENS.forEach((value: any, key: any) => {
        resp.data[value.coingeckoId] &&
          pricesMap.set(key, resp.data[value.coingeckoId].usd);
      });
      setCoingeckoPrices(pricesMap);
    } catch (e) {
      // console.log("coingecko api error: ", e);
    }
  }

  async function getNomicsPrices() {
    let tokenIds = [...apiIds.nomics].join(",");
    let resp: any;

    try {
      resp = await axios.get(
        `https://api.nomics.com/v1/currencies/ticker?ids=${tokenIds}&key=` +
          import.meta.env.VITE_NOMICS_API_KEY
      );
      const pricesMap = new Map();
      const nomicsMap = resp.data.reduce(function (result: any, item: any) {
        return result.set(item.id, item.price);
      }, new Map());

      bondLibrary.TOKENS.forEach((value: any, key: any) => {
        nomicsMap.get(value.nomicsId) &&
          pricesMap.set(key, nomicsMap.get(value.nomicsId));
      });
      setNomicsPrices(pricesMap);
    } catch (e) {
      console.log("Nomics API error: ", e);
    }
  }

  async function getCustomPrices() {
    const requests: Set<Promise<string>> = new Set();
    const fns: Map<() => Promise<string>, string[]> = new Map();
    const pricesMap = new Map();

    try {
      bondLibrary.TOKENS.forEach((value: any, key: any) => {
        const currentValue = fns.get(value.customPriceFunction) || [];

        if (currentValue.length === 0) {
          value.customPriceFunction &&
            requests.add(
              value.customPriceFunction().then((result: any) => {
                currentValue.forEach((value) => {
                  pricesMap.set(value, result);
                });
                return result;
              })
            );
        }

        currentValue.push(key);
        value.customPriceFunction &&
          fns.set(value.customPriceFunction, currentValue);
      });
    } catch (e) {
      console.log("Error loading custom prices: ", e);
    }

    await Promise.all(requests);
    setCustomPrices(pricesMap);
  }

  useEffect(() => {
    if (rinkebyData && rinkebyData.tokens && goerliData && goerliData.tokens) {
      const allMarkets = rinkebyData.tokens.concat(goerliData.tokens);
      // @ts-ignore
      setTestnet(allMarkets);
      void getCoingeckoPrices();
      void getNomicsPrices();
      void getCustomPrices();
    }
  }, [rinkebyData, goerliData]);

  return {
    mainnet: mainnet,
    testnet: testnet,
    coingeckoPrices: coingeckoPrices,
    nomicsPrices: nomicsPrices,
    customPrices: customPrices,
  };
}

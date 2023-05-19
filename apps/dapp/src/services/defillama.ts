import { generateFetcher } from "./custom-queries";

export const DEFILLAMA_ENDPOINT = "https://coins.llama.fi";

export type DefillamaCurrentPrice = {
  decimals: number;
  symbol: string;
  price: number;
  timestamp: number;
  confidence: number;
};

export type DefillamaCurrentPricesResponse = Promise<{
  coins: DefillamaCurrentPrice;
}>;

/**
 * @param address Strings should be in a `<chainName>:<address>` or `coingecko:<apiId>`
 * example:
 *  `ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`
 *  `coingecko:ethereum`
 */
export const fetchPrice = (
  address: string,
  chain: string
): DefillamaCurrentPricesResponse => {
  const endpoint = `${DEFILLAMA_ENDPOINT}/prices/current/${chain}:${address}`;
  return generateFetcher(endpoint)();
};

/**
 * @param addresses Strings should be in a `<chainName>:<address>` or `coingecko:<apiId>`
 * example:
 *  `ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`
 *  `coingecko:ethereum`
 */
export const fetchMultiple = (
  addresses: string[]
): DefillamaCurrentPricesResponse => {
  const ids = addresses.join(",");
  const endpoint = `${DEFILLAMA_ENDPOINT}/prices/current/${ids}`;

  return generateFetcher(endpoint)();
};

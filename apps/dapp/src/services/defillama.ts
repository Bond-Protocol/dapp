import { sub, getUnixTime } from "date-fns";
import { generateFetcher } from "./custom-queries";
import { ACTIVE_CHAINS, MAINNETS } from "context/evm-provider";

export const DEFILLAMA_ENDPOINT = "https://coins.llama.fi";

export interface DefillamaCurrentPrice {
  decimals: number;
  symbol: string;
  name: string;
  price: number;
  timestamp: number;
  confidence: number;
  chainId: number;
  address: string;
}

export interface DefillamaChart extends Omit<DefillamaCurrentPrice, "price"> {
  prices: Array<{
    timestamp: number;
    price: number;
  }>;
}

/**
 * @param address string - An 0x address
 * @param address string[] - Strings should be in a `<chainName>:<address>` or `coingecko:<apiId>`
 * @param chainId number - The chain id
 *
 * example:
 *  `ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`
 *  `coingecko:ethereum`
 */
export const fetchPrice = async (
  address: string | string[],
  chainId?: number
): Promise<Array<DefillamaChart>> => {
  const ids = Array.isArray(address)
    ? address.join(",")
    : `${getNameFromChainId(Number(chainId))}:${address}`;

  const endpoint = `${DEFILLAMA_ENDPOINT}/prices/current/${ids}`;

  const response = await generateFetcher(endpoint)();

  return formatResponse(response.coins, chainId);
};

type ChartOptionsDefillama = {
  chainId: number;
  days: number;
};

export const fetchChart = async (
  address: string | string[],
  options: ChartOptionsDefillama
): Promise<Array<DefillamaChart>> => {
  const chain = options?.chainId && getNameFromChainId(options?.chainId);

  const ids = Array.isArray(address)
    ? address.join(",")
    : `${chain}:${address}`;

  const from = getUnixTime(sub(Date.now(), { days: options.days }));

  const endpoint = `${DEFILLAMA_ENDPOINT}/chart/${ids}`;
  const period = "1h";
  const span = options.days * 24;
  const params = `?start=${from}&span=${span}&period=${period}`;

  const response = await generateFetcher(endpoint + params)();
  return formatResponse(response.coins ?? {}, options.chainId);
};

/**The response format isnt very useful so we tweak it*/
export const formatResponse = (coins: any, chainId?: number) => {
  return Object.keys(coins).map((id) => {
    const content = coins[id];
    const [_chain, address] = id.split(":");
    return { ...content, address, chainId, name: "" };
  });
};

/** Gets defillama query id from a token in tokenlist format */
export const toDefillamaQueryId = (t: any) => {
  const name = getNameFromChainId(Number(t.chainId));
  return `${name}:${t.address}`;
};

/** Maps chainIds to names to use in defillama queries*/
export const getNameFromChainId = (chainId: number) => {
  const chain = MAINNETS.find((c: any) => c.id === chainId);
  const name = chain?.name.split(" ")[0] ?? ""; // The api supports 'arbitrum' instead of 'arbitrum-one' :pepe_angry_sip:
  return name.toLowerCase();
};

export const getSwapURL = (
  chainId: number | string,
  payoutToken: string,
  baseToken = "0x0000000000000000000000000000000000000000" // ETH
) => {
  const chain = getNameFromChainId(Number(chainId));
  return `https://swap.defillama.com/?chain=${chain}&from=${baseToken}&to=${payoutToken}`;
};

export const utils = {
  unwrapPrices: formatResponse,
  toDefillamaQueryId,
};

export default {
  fetchPrice,
  fetchChart,
  getSwapURL,
  utils,
};

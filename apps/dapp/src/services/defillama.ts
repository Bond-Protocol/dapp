import { sub, getUnixTime } from "date-fns";
import { generateFetcher } from "./custom-queries";
import { ACTIVE_CHAINS } from "context/evm-provider";

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
  chainId: number
): Promise<Array<DefillamaChart>> => {
  const chain = getNameFromChainId(chainId);

  const ids = Array.isArray(address)
    ? address.join(",")
    : `${chain}:${address}`;

  const endpoint = `${DEFILLAMA_ENDPOINT}/prices/current/${ids}`;

  const response = await generateFetcher(endpoint)();

  return formatResponse(response.coins);
};

type ChartOptionsDefillama = {
  chainId?: number;
  from?: number;
  to: number;
  days: number;
};

export const fetchChart = async (
  address: string | string[],
  options: ChartOptionsDefillama = {
    to: Date.now(),
    days: 7,
  }
): Promise<Array<DefillamaChart>> => {
  const chain = options?.chainId && getNameFromChainId(options?.chainId);

  const ids = Array.isArray(address)
    ? address.join(",")
    : `${chain}:${address}`;

  const from = sub(options.to, { days: options.days });
  const fromTimestamp = getUnixTime(from);

  //const toTimestamp = getUnixTime(to);
  console.log({ options });

  const endpoint = `${DEFILLAMA_ENDPOINT}/chart/${ids}`;
  const period = "1h";
  const span = options.days * 24;
  const params = `?start=${fromTimestamp}&span=${span}&period=${period}`;

  const response = await generateFetcher(endpoint + params)();
  return formatResponse(response.coins);
};

/**The response format isnt very useful so we tweak it*/
export const formatResponse = (coins: any) => {
  return Object.keys(coins).map((id) => {
    const content = coins[id];
    const [chain, address] = id.split(":");
    return { ...content, address, chain };
  });
};

/** Gets defillama query id from a token in tokenlist format */
export const toDefillamaQueryId = (t: any) => {
  const name = getNameFromChainId(t.chainId);
  return `${name}:${t.address}`;
};

/** Maps chainIds to names to use in defillama queries*/
export const getNameFromChainId = (chainId: number) => {
  const chain = ACTIVE_CHAINS.find((c: any) => c.id === chainId);
  const name = chain?.name.split(" ")[0] ?? ""; // The api supports 'arbitrum' instead of 'arbitrum-one' :pepe_angry_sip:
  return name.toLowerCase();
};

export const utils = {
  unwrapPrices: formatResponse,
  toDefillamaQueryId,
};

export default {
  fetchPrice,
  fetchChart,
  utils,
};

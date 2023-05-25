import { generateFetcher } from "./custom-queries";
import { ACTIVE_CHAINS } from "context/evm-provider";

export const DEFILLAMA_ENDPOINT = "https://coins.llama.fi";

export type DefillamaCurrentPrice = {
  decimals: number;
  symbol: string;
  name: string;
  price: number;
  timestamp: number;
  confidence: number;
  chainId: number;
  address: string;
};

export type DefillamaCurrentPricesResponse = {
  coins: DefillamaCurrentPrice;
};

/**
 * @param address string - An 0x address
 * @param address string[] - Strings should be in a `<chainName>:<address>` or `coingecko:<apiId>`
 *  @param chain string - The chain name
 *
 * example:
 *  `ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8`
 *  `coingecko:ethereum`
 */
export const fetchPrice = async (
  address: string | string[],
  chainId: number
): Promise<Array<DefillamaCurrentPrice>> => {
  const chain = getNameFromChainId(chainId);

  const ids = Array.isArray(address)
    ? address.join(",")
    : `${chain}:${address}`;

  const endpoint = `${DEFILLAMA_ENDPOINT}/prices/current/${ids}`;

  const response = await generateFetcher(endpoint)();

  return formatPriceResponse(response.coins);
};

/**The response format isnt very useful so we tweak it*/
export const formatPriceResponse = (coins: any) => {
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
  unwrapPrices: formatPriceResponse,
  toDefillamaQueryId,
};

export default {
  fetchPrice,
};

import { DefillamaCurrentPrice } from "services/defillama";
import { Address } from "viem";

interface DefillamaTokenResponse {
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
  decimals: number;
}

interface DefillamaPricesResponse {
  coins: {
    [key: string]: DefillamaTokenResponse;
  };
}

const chainIdMap: { [key: string]: number } = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  avalanche: 43114,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
};

/**
 * Formats Defillama API current price response
 * @param {DefillamaPricesResponse} apiResponse - The original API response
 * @returns {TransformedCoin[]} - Array of coin objects with extracted information
 */
export function formatPriceResponse(
  apiResponse: DefillamaPricesResponse
): DefillamaCurrentPrice[] {
  return Object.entries(apiResponse.coins).map(([key, coinData]) => {
    const [chainName, address] = key.split(":");

    const chainId = chainIdMap[chainName];
    if (!chainId) {
      throw new Error(`Unable to get chain id for ${chainName}`);
    }

    return {
      ...coinData,
      chainId,
      address: address as Address,
    };
  });
}

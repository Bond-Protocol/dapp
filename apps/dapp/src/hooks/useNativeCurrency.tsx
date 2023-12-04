import { getChain } from "@bond-protocol/contract-library";
import { useTokens } from "hooks";

export const useNativeCurrency = (chainId: string) => {
  const { tokens } = useTokens();

  const nativeCurrency = getChain(chainId)?.nativeCurrency || {
    decimals: 18,
    name: "Ethereum",
    symbol: "WETH",
  };

  const nativeCurrencyPrice: number =
    tokens.find(
      ({ symbol }) =>
        symbol.toLowerCase() === nativeCurrency.symbol.toLowerCase()
    )?.price ??
    tokens.find((t) => t.symbol.toLowerCase() === "weth")?.price ??
    0;

  return { nativeCurrency, nativeCurrencyPrice };
};

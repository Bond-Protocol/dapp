import { useTokens } from "hooks";
import { CHAINS, NativeCurrency } from "@bond-protocol/contract-library";

export const useNativeCurrency = (chainId: string) => {
  const { tokens } = useTokens();

  const nativeCurrency: NativeCurrency = CHAINS.get(chainId)
    ?.nativeCurrency || {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  };

  const nativeCurrencyPrice =
    tokens.find(
      ({ name }) => name.toLowerCase() === nativeCurrency.name.toLowerCase()
    ) || 0;

  return { nativeCurrency, nativeCurrencyPrice };
};

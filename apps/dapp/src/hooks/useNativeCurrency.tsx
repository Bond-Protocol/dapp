import { CHAINS, NativeCurrency } from "@bond-protocol/bond-library";
import { useTokens } from "hooks";

export const useNativeCurreny = (network: string) => {
  const { getPrice } = useTokens();

  const nativeCurrency: NativeCurrency = CHAINS.get(network)
    ?.nativeCurrency || {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  };

  const nativeCurrencyPrice = getPrice(nativeCurrency.symbol);

  return { nativeCurrency, nativeCurrencyPrice };
};

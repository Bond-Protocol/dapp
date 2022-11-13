import { ethers } from "ethers";
import { CHAINS, NativeCurrency } from "@bond-protocol/bond-library";
import { providers } from "services/owned-providers";
import { useTokens } from "hooks/useTokens";

export const useGasPrice = () => {
  const { getPrice } = useTokens();

  const getGasPrice = async (chainName: string) => {
    const nativeCurrency: NativeCurrency | undefined =
      CHAINS.get(chainName)?.nativeCurrency;
    const price = getPrice(nativeCurrency?.symbol.toString() || "eth");

    const gasPrice = await providers[chainName]?.getFeeData().then((result) => {
      if (result.maxFeePerGas === null) return "0";
      return Number(
        ethers.utils.formatUnits(
          result.maxFeePerGas,
          nativeCurrency?.decimals || 18
        )
      ).toFixed(18);
    });
    return {
      gasPrice,
      usdPrice: (Number(gasPrice) * price).toFixed(18),
    };
  };

  return {
    getGasPrice: (chainName: string) => getGasPrice(chainName),
  };
};

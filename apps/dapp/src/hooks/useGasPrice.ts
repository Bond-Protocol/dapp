import { ethers } from "ethers";
import { NativeCurrency } from "@bond-protocol/bond-library";
import { Provider } from "@ethersproject/providers";

export const useGasPrice = () => {
  const getGasPrice = async (
    currency: NativeCurrency,
    currencyPrice: number,
    provider: Provider
  ) => {
    const gasPrice = await provider.getFeeData().then((result) => {
      if (result.maxFeePerGas === null) return "0";
      return Number(
        ethers.utils.formatUnits(result.maxFeePerGas, currency.decimals)
      ).toFixed(currency.decimals);
    });
    return {
      gasPrice,
      usdPrice: (Number(gasPrice) * currencyPrice).toFixed(currency.decimals),
    };
  };

  return {
    getGasPrice: (
      currency: NativeCurrency,
      currencyPrice: number,
      provider: Provider
    ) => getGasPrice(currency, currencyPrice, provider),
  };
};

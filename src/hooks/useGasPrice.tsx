import {providers} from "services/owned-providers";
import {CHAINS, TOKENS} from "@bond-protocol/bond-library";
import {ethers} from "ethers";
import {useTokens} from "hooks/useTokens";
import {NativeCurrency} from "@bond-protocol/bond-library/dist/chains/chains";

export const useGasPrice = () => {
  const {getPrice} = useTokens();

  const getGasPrice = async (chainName: string) => {
    const nativeCurrency: NativeCurrency | undefined = CHAINS.get(chainName)?.nativeCurrency;
    const price = getPrice(nativeCurrency?.symbol.toString() || "eth");

    let gasPrice = await providers[chainName]?.getFeeData().then(result => {
      if (result.maxFeePerGas === null) return "0";
      return Number(ethers.utils.formatUnits(result.maxFeePerGas, nativeCurrency?.decimals || 18)).toFixed(18);
    })
    return {
      gasPrice,
      usdPrice: (Number(gasPrice) * price).toFixed(18),
    }
  }

  return {
    getGasPrice: (chainName: string) => getGasPrice(chainName),
  }
}

import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Provider } from "@ethersproject/providers";

export type CustomPriceFunction = (provider?: Provider) => Promise<number>;

// Add a name for your custom feed to this enum
export enum CUSTOM_PRICE_FEEDS {
  US_STABLE = "us_stable",
  PPO = "PPO",
  CVOL = "CVOL",
  DEXFI_GDEX = "gDEX",
  DEXFI_USDEX = "USDEX+"
}

/*
  Define your custom price feed below.
  - If on chain requests are required, an ethers `Provider` should be passed to your function.
  - If using a service which requires an API key, please contact us first to check whether it will be possible.
  - Throw a standard ES5 Error in case of failure.
 */
export default {
  [CUSTOM_PRICE_FEEDS.US_STABLE]: async () => 1.0,
  [CUSTOM_PRICE_FEEDS.PPO]: async (provider: Provider) => {
    const ORACLE_ABI = ["function getFixedPrice() view returns (uint256)"];
    const ORACLE_ADDRESS = "0x503aef858e26C136C29e40483EA0297160d2BDC0";
    const PRICE_DECIMALS = 6;

    try {
      const fixedPriceContract = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, provider);

      const priceBN = await fixedPriceContract.getFixedPrice();

      if (priceBN) return +formatUnits(priceBN, PRICE_DECIMALS);
    } catch (e) {
      // @ts-ignore
      throw new Error(e);
    }
  },
  [CUSTOM_PRICE_FEEDS.CVOL]: async (provider: Provider) => {
    const TV_CVOL_TOKEN_ABI = ["function totalBalance() external view returns (uint256 balance, uint256 usdcPlatformLiquidity, uint256 intrinsicDEXVolTokenBalance, uint256 volTokenPositionBalance, uint256 dexUSDCAmount, uint256 dexVolTokensAmount)", "function totalSupply() external view returns (uint)"];
    const TV_CVOL_TOKEN_ADDRESS = "0xFDeB59a2B4891ea17610EE38665249acC9FCC506";
    const TV_CVOL_DECIMALS = 18;
    const USDC_DECIMALS = 6;

    try {
      const tvCvolContract = new ethers.Contract(TV_CVOL_TOKEN_ADDRESS, TV_CVOL_TOKEN_ABI, provider);

      const [{ balance }, supply] = await Promise.all([tvCvolContract.totalBalance(), tvCvolContract.totalSupply()]);

      if (supply.isZero()) {
        return 0
      }

      const usdcAmountBN = ethers.utils.parseUnits("1", TV_CVOL_DECIMALS).mul(balance).div(supply)
      return formatUnits(usdcAmountBN, USDC_DECIMALS)

    } catch (e) {
      // @ts-ignore
      throw new Error(e);
    }
  },
  [CUSTOM_PRICE_FEEDS.DEXFI_USDEX]: async (provider: Provider) => {
    const startOfPath = ['0x2c093F7d7Db41057A2ddD3cB1AD8b4E9C3dFfBec']
    return getDexfinanceTokenPrice(startOfPath, provider)
  },
  [CUSTOM_PRICE_FEEDS.DEXFI_GDEX]: async (provider: Provider) => {
    const startOfPath = ['0xda064d44871bA31Dae33A65B3E23B37E44E9168A', '0x2c093F7d7Db41057A2ddD3cB1AD8b4E9C3dFfBec']
    return getDexfinanceTokenPrice(startOfPath, provider)
  }
} as { [key: string]: CustomPriceFunction };

async function getDexfinanceTokenPrice(startOfPath: string[], provider: Provider) {
  try {
    const DEXSWAP_ROUTER_ABI = ["function getAmountsOut(uint256 amountIn, address[] calldata path, address caller) external view returns(uint256[] memory amounts)"];
    const DEXSWAP_ROUTER_ADDRESS = "0x6513b561c61d6032D0Ac2dB54739DFaFb8381d62";
    const USDC_DECIMALS = 6;
    const dexSwapRouter = new ethers.Contract(DEXSWAP_ROUTER_ADDRESS, DEXSWAP_ROUTER_ABI, provider);

    const multiplier = 1e3;
    const path = [...startOfPath, "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"];
    const inputAmountBN = ethers.utils.parseUnits("1", 18).div(multiplier);
    const caller = '0x0000000000000000000000000000000000000000';
    const amounts = await dexSwapRouter.getAmountsOut(inputAmountBN, path, caller);

    const a1Raw = amounts[amounts.length - 1];
    const resultPrice = formatUnits(ethers.BigNumber.from(a1Raw).mul(multiplier), USDC_DECIMALS);
    return +resultPrice;
  } catch (e) {
    // @ts-ignore
    throw new Error(e);
  }
}

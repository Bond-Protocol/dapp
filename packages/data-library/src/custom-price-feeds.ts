import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { CustomPriceFunction } from "./types";
import { Provider } from "@ethersproject/providers";

// Add a name for your custom feed to this enum
export enum CUSTOM_PRICE_FEEDS {
  US_STABLE = "us_stable",
  PPO = "PPO",
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
} as { [key: string]: CustomPriceFunction };

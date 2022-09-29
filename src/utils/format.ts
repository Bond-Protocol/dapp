import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BigNumberish } from "ethers";

export const formatLongNumber = (
  num: string | number | BigNumberish,
  currentDecimals: number
) => {
  return Number(num) / Math.pow(10, currentDecimals);
};

export const formatVestingTerm = (market: CalculatedMarket) => {
  return market.vestingType === "fixed-term"
    ? market.formattedLongVesting
    : market.formattedShortVesting;
};

export default {
  formatLongNumber,
  formatVestingTerm,
};

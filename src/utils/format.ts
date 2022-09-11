import { CalculatedMarket } from "@bond-labs/contract-library";
import { BigNumberish } from "ethers";

export const formatLongNumber = (
  num: string | number | BigNumberish,
  currentDecimals = 18
) => {
  return Number(num) / Math.pow(10, currentDecimals);
};

export const formatVestingTerm = (market: CalculatedMarket) => {
  return market.vestingType === "fixed-term"
    ? market.formattedLongVesting
    : market.formattedShortVesting;
};

export default { formatLongNumber, formatVestingTerm };

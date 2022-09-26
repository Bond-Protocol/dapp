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

export const formatDecimalsForDisplay = (num: number, decimalsToKeep = 2) => {
  const isRound =
    Math.trunc(num).toFixed(decimalsToKeep) === num.toFixed(decimalsToKeep);
  return isRound ? Math.trunc(num) : num.toFixed(decimalsToKeep);
};

export default {
  formatLongNumber,
  formatVestingTerm,
  formatDecimalsForDisplay,
};

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

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const usdLongFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  maximumFractionDigits: 0,
});

export const longFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const usdFullFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const dynamicFormatter = (num: string) => {
  if (!num?.split) return num;
  let maximumFractionDigits = 0;
  let [single, decimal] = num.split(".").map((n) => parseFloat(n));

  if (decimal > 1000) {
    maximumFractionDigits = 6;
  }

  if (decimal > 100) {
    maximumFractionDigits = 5;
  }

  if (single > 0) {
    maximumFractionDigits = 2;
  }

  if (single > 1000) {
    maximumFractionDigits = 0;
  }

  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "usd",
    maximumFractionDigits,
  }).format(parseFloat(num));
};

export default {
  formatLongNumber,
  formatVestingTerm,
};

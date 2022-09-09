import { BigNumberish } from "ethers";

export const formatLongNumber = (
  num: string | number | BigNumberish,
  currentDecimals = 18
) => {
  return Number(num) / Math.pow(10, currentDecimals);
};

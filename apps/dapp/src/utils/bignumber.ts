import { BigNumber } from "ethers";

export const toHex = (target: object) => {
  return Object.entries(target).reduce((o, [name, value]) => {
    return { ...o, [name]: BigInt(value).toString(16) };
  }, {});
};

export const fromHex = (target: object) => {
  return Object.entries(target).reduce((o, [name, value]) => {
    return { ...o, [name]: BigInt(value) };
  }, {});
};

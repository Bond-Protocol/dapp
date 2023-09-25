import { BigNumber } from "ethers";

export const toHex = (target: object) => {
  return Object.entries(target).reduce((o, [name, value]) => {
    return { ...o, [name]: BigNumber.from(value).toHexString() };
  }, {});
};

export const fromHex = (target: object) => {
  return Object.entries(target).reduce((o, [name, value]) => {
    return { ...o, [name]: BigNumber.from(value).toString() };
  }, {});
};

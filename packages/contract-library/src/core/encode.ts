import { defaultAbiCoder } from '@ethersproject/abi';

export const ERC20_APPROVE_SIGNATURE_TYPES = ['address', 'uint256'];

export const getAllowanceTxBytes = (spender: string, amount: string) => {
  return defaultAbiCoder.encode(ERC20_APPROVE_SIGNATURE_TYPES, [
    spender,
    amount,
  ]);
};

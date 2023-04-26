import { defaultAbiCoder } from '@ethersproject/abi';

export const ERC20_APPROVE_SIGNATURE = 'approve(address,uint256)';

export const getAllowanceTxBytes = (spender: string, amount: string) => {
  return defaultAbiCoder.encode([ERC20_APPROVE_SIGNATURE], [spender, amount]);
};

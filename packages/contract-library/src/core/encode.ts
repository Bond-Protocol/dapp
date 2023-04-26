import { defaultAbiCoder } from '@ethersproject/abi';
import { ethers } from 'ethers';

export const ERC20_APPROVE_SIGNATURE = 'approve(address,uint256)';
export const ERC20_APPROVE_SIGNATURE_TYPES = ['address', 'uint256'];

export const getAllowanceTxBytes = (spender: string, amount: string) => {
  const encodedData = defaultAbiCoder.encode(ERC20_APPROVE_SIGNATURE_TYPES, [
    spender,
    amount,
  ]);

  return ethers.utils.hexConcat([
    ethers.utils.id(ERC20_APPROVE_SIGNATURE),
    encodedData,
  ]);
};

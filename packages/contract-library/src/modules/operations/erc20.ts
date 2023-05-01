import { IERC20__factory } from 'src/types';

const erc20 = IERC20__factory.createInterface();

/** Generates bytecode for an ERC20 approve transaction */
export const getApproveTxBytecode = (address: string, amount: string) => {
  return erc20.encodeFunctionData('approve', [address, amount]);
};

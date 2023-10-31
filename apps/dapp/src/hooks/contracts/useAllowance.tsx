import { useEffect } from "react";
import { Address, isAddress, parseUnits } from "viem";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export type UseAllowanceProps = {
  tokenAddress: Address;
  chainId: number;
  decimals: number;
  ownerAddress: Address;
  spenderAddress: Address;
  amount: string;
};

export const useAllowance = (args: UseAllowanceProps) => {
  const parsedAmount = parseUnits(args.amount, args.decimals);

  const { config } = usePrepareContractWrite({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "approve",
    args: [args.spenderAddress, parsedAmount],
  });

  const approve = useContractWrite(config);

  const allowance = useContractRead({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "allowance",
    args: [args.ownerAddress as Address, args.spenderAddress as Address],
    enabled: !!args.ownerAddress,
  });

  const writeAsync = async () => {
    try {
      await approve?.writeAsync();
      await allowance.refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    approve,
    allowance,
    write: approve.write,
    writeAsync,
    currentAllowance: allowance.data,
  };
};

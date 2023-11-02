import { useEffect, useState, useSyncExternalStore } from "react";
import { Address, isAddress, parseUnits } from "viem";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export type UseAllowanceProps = {
  tokenAddress: Address;
  chainId: number;
  decimals: number;
  ownerAddress: Address;
  spenderAddress: Address;
  amount: string;
  enabled?: boolean;
};

export const useAllowance = (args: UseAllowanceProps) => {
  const [hash, setHash] = useState<Address>();

  const tx = useWaitForTransaction({
    hash,
  });

  useEffect(() => {
    allowance.refetch();
  }, [tx.isSuccess]);

  const parsedAmount = parseUnits(args.amount, args.decimals);
  const enabled =
    !!args.chainId &&
    !!args.tokenAddress &&
    !!args.spenderAddress &&
    !!args.ownerAddress;

  const { config } = usePrepareContractWrite({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "approve",
    args: [args.spenderAddress, parsedAmount],
    enabled: enabled && !!args.amount,
  });

  const approve = useContractWrite(config);

  const allowance = useContractRead({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "allowance",
    args: [args.ownerAddress as Address, args.spenderAddress as Address],
    enabled,
  });

  const execute = async () => {
    const res = await approve.writeAsync?.();
    setHash(res?.hash);
  };

  return {
    approve,
    approveTx: tx,
    execute,
    allowance,
    currentAllowance: allowance.data,
  };
};

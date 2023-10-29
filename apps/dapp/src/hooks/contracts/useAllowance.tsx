import { Address, parseUnits } from "viem";
import { erc20ABI, useContractRead, useContractWrite } from "wagmi";

export type UseAllowanceProps = {
  tokenAddress?: Address;
  chainId?: number;
  decimals?: number;
  ownerAddress?: Address;
  spenderAddress?: Address;
};

export const useAllowance = (args: UseAllowanceProps) => {
  const approve = useContractWrite({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "approve",
  });

  const allowance = useContractRead({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "allowance",
    enabled: !!(
      args.tokenAddress &&
      args.chainId &&
      args.spenderAddress &&
      args.ownerAddress
    ),
    args: [args.ownerAddress as Address, args.spenderAddress as Address],
  });

  const write = (spender: Address, amount: string) => {
    if (!args.decimals) throw new Error("No decimals in allowance");

    const adjustedAmount = parseUnits(amount, args.decimals);

    return approve.write({ args: [spender, adjustedAmount] });
  };

  return {
    approve,
    allowance,
    write,
    currentAllowance: allowance.data?.toString(),
  };
};

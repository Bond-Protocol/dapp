import { trimToken } from "formatters";
import { Address, useAccount, useBalance } from "wagmi";
import { useAllowance } from "./contracts/useAllowance";
import { parseUnits } from "viem";
import { useMemo } from "react";

export const useTokenAllowance = (
  tokenAddress: Address,
  tokenDecimals: number,
  networkId: string,
  amount: string,
  spender: Address
) => {
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    token: tokenAddress,
    chainId: Number(networkId),
  });

  const allowance = useAllowance({
    ownerAddress: address as Address,
    tokenAddress,
    amount,
    spenderAddress: spender,
    decimals: tokenDecimals,
    chainId: Number(networkId),
  });

  const approve = async () => {
    const res = await allowance.writeAsync();
    const ress = await allowance.allowance.refetch();
    console.log({ res, ress });
  };

  const parsedAmount = parseUnits(amount, tokenDecimals);

  const hasSufficientAllowance = useMemo(
    () => (allowance.currentAllowance ?? 0n) >= parsedAmount,
    [allowance.allowance.data]
  );

  const hasSufficientBalance = useMemo(
    () => (balance?.value ?? 0n) >= parsedAmount,
    [balance, amount]
  );
  console.log({ hasSufficientBalance, hasSufficientAllowance });

  return {
    approve,
    allowance,
    balance: trimToken(balance?.formatted ?? 0),
    hasSufficientAllowance,
    hasSufficientBalance,
    needsToApprove: !hasSufficientAllowance && hasSufficientBalance,
  };
};

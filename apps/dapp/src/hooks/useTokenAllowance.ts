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
  const { isConnected, address } = useAccount();

  const { data: balance } = useBalance({
    address,
    token: tokenAddress,
    chainId: Number(networkId),
    enabled: isConnected,
  });

  const allowance = useAllowance({
    tokenAddress,
    ownerAddress: address as Address,
    spenderAddress: spender,
    amount,
    decimals: tokenDecimals,
    chainId: Number(networkId),
    enabled: isConnected,
  });

  const parsedAmount = parseUnits(amount, tokenDecimals);

  const hasSufficientAllowance = useMemo(
    () => isConnected && (allowance.currentAllowance ?? 0n) >= parsedAmount,
    [isConnected, amount, allowance.allowance.data]
  );

  const hasSufficientBalance = useMemo(
    () => isConnected && (balance?.value ?? 0n) >= parsedAmount,
    [isConnected, balance, amount]
  );

  return {
    allowance,
    currentAllowance: allowance.currentAllowance,
    execute: allowance.execute,
    txStatus: allowance.approveTx,
    balance: trimToken(balance?.formatted ?? 0),
    hasSufficientAllowance,
    hasSufficientBalance,
    needsToApprove: !hasSufficientAllowance && hasSufficientBalance,
  };
};

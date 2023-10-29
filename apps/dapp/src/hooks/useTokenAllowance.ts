import { useCallback, useState } from "react";
import { calculateTrimDigits, trim } from "ui";
import { Address, useBalance } from "wagmi";
import { useAllowance } from "./contracts/useAllowance";

export const useTokenAllowance = (
  tokenAddress: Address,
  tokenDecimals: number,
  networkId: string
) => {
  const [balance, setBalance] = useState<string>("0");
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [allowance, setAllowance] = useState<string>("0");
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);

  const b = useBalance({ token: tokenAddress, chainId: Number(networkId) });
  const all = useAllowance({
    tokenAddress,
    decimals: tokenDecimals,
    chainId: Number(networkId),
  });

  const fetchAndSetBalance = useCallback(async () => {
    const result = 0; //await getBalance(tokenAddress, userAddress, provider);

    const balance = Number(result || "0") / Math.pow(10, tokenDecimals);
    setBalance(trim(balance, calculateTrimDigits(balance)));
  }, []);

  const approve = async (teller: Address, amount: string) => {
    all.write(teller, amount);
  };

  return {
    approve,
    allowance,
    balance,
    hasSufficientAllowance,
    hasSufficientBalance,
    needsToApprove: !hasSufficientAllowance && hasSufficientBalance,
  };
};

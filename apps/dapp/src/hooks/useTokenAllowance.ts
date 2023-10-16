import { useCallback, useEffect, useState } from "react";
import { Signer } from "ethers";
import { usePurchaseBond } from "src/hooks/usePurchaseBond";
import {
  calculateTrimDigits,
  trim,
  getBalance,
} from "@bond-protocol/contract-library";
import { Provider } from "@ethersproject/providers";

export const useTokenAllowance = (
  userAddress: string,
  tokenAddress: string,
  tokenDecimals: number,
  networkId: string,
  targetAddress: string,
  amount: string,
  provider: Provider,
  signer: Signer,
  isNotAuctioneerContract = false //TODO: improve this, wonky fix to allow approving all contracts vs bond tellers
) => {
  const [balance, setBalance] = useState<string>("0");
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [allowance, setAllowance] = useState<string>("0");
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const { approveSpending, getTokenAllowance } = usePurchaseBond();

  const fetchAndSetBalance = useCallback(async () => {
    const result = await getBalance(tokenAddress, userAddress, provider);

    const balance = Number(result || "0") / Math.pow(10, tokenDecimals);
    setBalance(trim(balance, calculateTrimDigits(balance)));
  }, [tokenAddress, userAddress, networkId, provider]);

  const fetchAndSetAllowance = useCallback(async () => {
    const allowance = await getTokenAllowance(
      tokenAddress,
      userAddress,
      targetAddress,
      tokenDecimals,
      provider,
      isNotAuctioneerContract
    );

    setAllowance(allowance.toString());
  }, [tokenAddress, userAddress, targetAddress, networkId, getTokenAllowance]);

  const approve = async (
    tokenAddress: string,
    tokenDecimals: number,
    auctioneer: string,
    overrideAmount?: string
  ) => {
    if (signer) {
      const approved = await approveSpending(
        tokenAddress,
        tokenDecimals,
        auctioneer,
        signer,
        overrideAmount ?? amount,
        isNotAuctioneerContract
      );
      const confirmed = await approved.wait();
      void fetchAndSetAllowance();
    } else throw new Error("No signer connected");
  };

  useEffect(() => {
    setHasSufficientAllowance(
      Number(allowance) > 0 && Number(allowance) >= Number(amount)
    );
  }, [allowance, amount]);

  useEffect(() => {
    setHasSufficientBalance(
      Number(balance) > 0 && Number(balance) >= Number(amount)
    );
  }, [tokenAddress, balance, amount]);

  useEffect(() => {
    void fetchAndSetAllowance();
    void fetchAndSetBalance();
  }, [tokenAddress, userAddress]);

  return {
    approve,
    allowance,
    balance,
    hasSufficientAllowance,
    hasSufficientBalance,
    needsToApprove: !hasSufficientAllowance && hasSufficientBalance,
  };
};

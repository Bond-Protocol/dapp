import { useState, useEffect, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { providers } from "services/owned-providers";
import { usePurchaseBond } from "./usePurchaseBond";
import {
  trim,
  calculateTrimDigits,
} from "@bond-protocol/contract-library/dist/core/utils";

export const useTokenAllowance = (
  tokenAddress: string,
  tokenDecimals: number,
  networkId: string,
  auctioneer: string,
  amount: string
) => {
  const [balance, setBalance] = useState<string>("0");
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [allowance, setAllowance] = useState<string>("0");
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const { address } = useAccount();
  const { approveSpending, getAllowance } = usePurchaseBond();

  const { data } = useBalance({
    token: tokenAddress,
    addressOrName: address,
    chainId: providers[networkId].network.chainId,
  });

  const fetchAndSetAllowance = useCallback(async () => {
    if (!address) throw Error("Not connected");

    const allowance = await getAllowance(
      tokenAddress,
      address,
      auctioneer,
      networkId,
      tokenDecimals
    );

    setAllowance(allowance.toString());
  }, [tokenAddress, address, auctioneer, networkId, getAllowance]);

  const approve = async (
    tokenAddress: string,
    tokenDecimals: number,
    auctioneer: string
  ) => {
    const approved = await approveSpending(
      tokenAddress,
      tokenDecimals,
      auctioneer
    );
    const confirmed = await approved.wait();
    void fetchAndSetAllowance();
  };

  useEffect(() => {
    const balance: number = Number(data?.formatted || "0");
    setBalance(trim(balance, calculateTrimDigits(balance)));
  }, [data]);

  useEffect(() => {
    setHasSufficientAllowance(
      Number(allowance) > 0 && Number(allowance) >= Number(amount)
    );
  }, [allowance, amount]);

  useEffect(() => {
    setHasSufficientBalance(
      Number(balance) > 0 && Number(balance) >= Number(amount)
    );
  }, [balance, amount]);

  useEffect(() => {
    void fetchAndSetAllowance();
  }, []);

  return {
    approve,
    allowance,
    balance,
    hasSufficientAllowance,
    hasSufficientBalance,
  };
};

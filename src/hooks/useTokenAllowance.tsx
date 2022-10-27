import {useCallback, useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {providers} from "services/owned-providers";
import {usePurchaseBond} from "./usePurchaseBond";
import {calculateTrimDigits, trim,} from "@bond-protocol/contract-library/dist/core/utils";
import * as contractLibrary from "@bond-protocol/contract-library";

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
  const {address, isConnected} = useAccount();
  const {approveSpending, getAllowance} = usePurchaseBond();

  const fetchAndSetBalance = useCallback(async () => {
    if (!isConnected || !address) {
      setBalance("0");
      return;
    }

    const result = await contractLibrary.getBalance(
      tokenAddress,
      address,
      providers[networkId]
    );

    const balance = Number(result || "0") / Math.pow(10, tokenDecimals);
    setBalance(trim(balance, calculateTrimDigits(balance)));
  }, [tokenAddress, address, networkId, isConnected]);

  const fetchAndSetAllowance = useCallback(async () => {
    if (!isConnected || !address) {
      setAllowance("0");
      return;
    }

    const allowance = await getAllowance(
      tokenAddress,
      address,
      auctioneer,
      networkId,
      tokenDecimals
    );

    setAllowance(allowance.toString());
  }, [tokenAddress, address, isConnected, auctioneer, networkId, getAllowance]);

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
    void fetchAndSetBalance();
  }, [isConnected, address]);

  return {
    approve,
    allowance,
    balance,
    hasSufficientAllowance,
    hasSufficientBalance,
  };
};

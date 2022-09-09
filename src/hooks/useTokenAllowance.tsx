import { useState, useEffect, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { providers } from "services/owned-providers";
import { usePurchaseBond } from "./usePurchaseBond";

export const useTokenAllowance = (
  tokenAddress: string,
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
      networkId
    );

    setAllowance(allowance.toString());
    console.log({ allowance }, "fetch end");
  }, [tokenAddress, address, auctioneer, networkId, getAllowance]);

  const approve = async (tokenAddress: string, auctioneer: string) => {
    const approved = await approveSpending(tokenAddress, auctioneer);
    const confirmed = await approved.wait();
    console.log({ approved, confirmed });
    void fetchAndSetAllowance();
  };

  useEffect(() => {
    const balance: string = data?.formatted || "0";
    setBalance(balance);
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

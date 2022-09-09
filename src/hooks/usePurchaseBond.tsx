import { useState, useCallback } from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import { BigNumberish, ContractTransaction, Signer } from "ethers";
import { useProvider, useSigner } from "wagmi";
import { providers } from "services/owned-providers";

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

export type PurchaseArgs = {
  address: string;
  marketId: number;
  amount: number;
  minimumOut: number;
  teller: string;
  signer: Signer;
  referralAddress?: string;
  payout: string;
  slippage: number;
};

export const usePurchaseBond = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [txStatus, setTxStatus] = useState();

  const approveSpending = async (
    tokenAddress: string,
    auctioneer: string
  ): Promise<ContractTransaction> => {
    if (!signer) throw Error("Not connected");
    return contractLibrary.changeApproval(
      tokenAddress,
      auctioneer,
      "1000000000",
      signer
    );
  };

  const getAllowance = async (
    tokenAddress: string,
    address: string,
    auctioneer: string,
    network: string
  ) => {
    const requestProvider = providers[network];
    const allowance: BigNumberish = await contractLibrary.getAllowance(
      tokenAddress,
      address,
      auctioneer,
      requestProvider
    );
    return Number(allowance) / Math.pow(10, 18);
  };

  const getMaxBondableAmount = (balance: string, maxAmountAccepted: number) => {
    return Math.min(Number(balance), maxAmountAccepted);
  };

  const getPayoutFor = useCallback(
    async (
      amount: string,
      marketId: number,
      auctioneer: string,
      requestProvider?: typeof provider
    ): Promise<BigNumberish> => {
      return contractLibrary.payoutFor(
        requestProvider || provider,
        amount,
        marketId,
        auctioneer,
        REFERRAL_ADDRESS
      );
    },
    [provider]
  );

  const bond = useCallback(
    async (args: {
      address: string;
      marketId: number;
      amount: string;
      teller: string;
      referralAddress?: string;
      payout: string;
      slippage: number;
    }): Promise<ContractTransaction> => {
      if (!signer) throw Error("Not connected");

      const { payout, slippage, ...rest } = args;
      const minimumOut = Number(payout) - Number(payout) * (slippage / 100);

      return contractLibrary.purchase(
        rest.address,
        REFERRAL_ADDRESS,
        rest.marketId,
        Number(rest.amount).toFixed(18),
        minimumOut.toFixed(18),
        rest.teller,
        signer,
        {
          gasPrice: 100,
          gasLimit: 10000000,
        }
      );
    },
    [signer]
  );

  return {
    approveSpending,
    getMaxBondableAmount,
    getPayoutFor,
    getAllowance,
    bond,
  };
};

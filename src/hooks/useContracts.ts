import { useCallback } from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import { BigNumberish, ContractTransaction, Signer } from "ethers";
import { useProvider, useSigner } from "wagmi";

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

type PurchaseArgs = {
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

export const useContracts = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();

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
    async (args: PurchaseArgs): Promise<ContractTransaction> => {
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

  return { getPayoutFor, bond };
};

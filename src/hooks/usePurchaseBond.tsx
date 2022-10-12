//@ts-nocheck
import { useCallback } from "react";
import * as contractLibrary from "@bond-protocol/contract-library";
import { BigNumberish, ContractTransaction, ethers, Signer } from "ethers";
import { useProvider, useSigner } from "wagmi";
import { providers } from "services/owned-providers";
import { CalculatedMarket } from "@bond-protocol/contract-library";

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const usePurchaseBond = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const approveSpending = async (
    tokenAddress: string,
    tokenDecimals: number,
    auctioneer: string
  ): Promise<ContractTransaction> => {
    if (!signer) throw Error("Not connected");
    return contractLibrary.changeApproval(
      tokenAddress,
      tokenDecimals,
      auctioneer,
      "1000000000",
      signer
    );
  };

  const getAllowance = async (
    tokenAddress: string,
    address: string,
    auctioneer: string,
    network: string,
    decimals: number
  ) => {
    const requestProvider = providers[network];
    const allowance: BigNumberish = await contractLibrary.getAllowance(
      tokenAddress,
      address,
      auctioneer,
      requestProvider
    );
    return Number(allowance) / Math.pow(10, decimals);
  };

  const getMaxBondableAmount = (balance: string, maxAmountAccepted: string) => {
    return Math.min(Number(balance), Number(maxAmountAccepted));
  };

  const getPayoutFor = useCallback(
    async (
      amount: string,
      decimals: number,
      marketId: number,
      auctioneer: string,
      requestProvider?: typeof provider
    ): Promise<BigNumberish> => {
      const amt = ethers.utils.parseUnits(amount, decimals);

      return contractLibrary.payoutFor(
        requestProvider || provider,
        amt.toString(),
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
      amount: string;
      payout: string;
      slippage: number;
      market: CalculatedMarket;
    }): Promise<ContractTransaction> => {
      if (!signer) throw Error("Not connected");

      const { address, amount, payout, slippage, market } = args;
      const minimumOut = Number(payout) - Number(payout) * (slippage / 100);

      const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
        market.network.concat("_").concat(market.owner)
      )
        ? NO_REFERRAL_ADDRESS
        : REFERRAL_ADDRESS;

      return contractLibrary.purchase(
        address,
        referralAddress,
        market.marketId,
        amount,
        minimumOut,
        market.payoutToken.decimals,
        market.quoteToken.decimals,
        market.teller,
        signer,
        {}
      );
    },
    [signer]
  );

  const estimateBond = useCallback(
    async (args: {
      address: string;
      amount: string;
      payout: string;
      slippage: number;
      market: CalculatedMarket;
    }): Promise<BigNumberish> => {
      if (!signer) throw Error("Not connected");

      const { address, amount, payout, slippage, market } = args;
      const minimumOut = Number(payout) - Number(payout) * (slippage / 100);

      const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
        market.network.concat("_").concat(market.owner)
      )
        ? NO_REFERRAL_ADDRESS
        : REFERRAL_ADDRESS;

      try {
        return contractLibrary.estimatePurchaseGas(
          address,
          referralAddress,
          market.marketId,
          amount,
          minimumOut,
          market.payoutToken.decimals,
          market.quoteToken.decimals,
          market.teller,
          signer,
          {}
        );
      } catch (e) {
        console.log(e);
        throw Error(e);
      }
    },
    [signer]
  );

  return {
    approveSpending,
    getMaxBondableAmount,
    getPayoutFor,
    getAllowance,
    bond,
    estimateBond,
  };
};

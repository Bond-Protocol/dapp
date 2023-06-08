import { useCallback } from "react";
import { BigNumber, BigNumberish, ContractTransaction, Signer } from "ethers";
import {
  changeApproval,
  estimatePurchaseGas,
  getAllowance,
  payoutFor,
  purchase,
  CalculatedMarket,
} from "@bond-protocol/contract-library";
import { Provider } from "@ethersproject/providers";

export const usePurchaseBond = () => {
  const approveSpending = async (
    tokenAddress: string,
    tokenDecimals: number,
    auctioneer: string,
    signer: Signer,
    capacity = "1000000000"
  ): Promise<ContractTransaction> => {
    if (!signer) throw Error("Not connected");
    return changeApproval(
      tokenAddress,
      tokenDecimals,
      auctioneer,
      capacity,
      signer
    );
  };

  const getTokenAllowance = async (
    tokenAddress: string,
    address: string,
    auctioneer: string,
    decimals: number,
    provider: Provider
  ) => {
    const allowance: BigNumberish = await getAllowance(
      tokenAddress,
      address,
      auctioneer,
      provider
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
      referralAddress: string,
      provider: Provider
    ): Promise<BigNumberish> => {
      try {
        return payoutFor(
          marketId,
          amount,
          decimals,
          referralAddress,
          provider
        );
      } catch (e) {
        console.log(e);
        return BigNumber.from(0);
      }
    },
    []
  );

  const bond = useCallback(
    async (
      address: string,
      amount: string,
      payout: string,
      slippage: number,
      market: CalculatedMarket,
      referralAddress: string,
      signer: Signer
    ): Promise<ContractTransaction> => {
      const minimumOut = Number(payout) - Number(payout) * (slippage / 100);
      /*
      const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
        market.chainId.concat("_").concat(market.owner)
      )
        ? NO_REFERRAL_ADDRESS
        : REFERRAL_ADDRESS;
*/
      return purchase(
        address,
        referralAddress,
        market.marketId,
        amount,
        minimumOut.toString(),
        market.payoutToken.decimals,
        market.quoteToken.decimals,
        market.teller,
        signer,
        {}
      );
    },
    []
  );

  const estimateBond = useCallback(
    async (
      address: string,
      amount: string,
      payout: string,
      slippage: number,
      market: CalculatedMarket,
      referralAddress: string,
      signer: Signer
    ): Promise<BigNumberish> => {
      const minimumOut = Number(payout) - Number(payout) * (slippage / 100);
      /*
      const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
        market.chainId.concat("_").concat(market.owner)
      )
        ? NO_REFERRAL_ADDRESS
        : REFERRAL_ADDRESS;
*/
      try {
        return estimatePurchaseGas(
          address,
          referralAddress,
          market.marketId,
          amount,
          minimumOut.toString(),
          market.payoutToken.decimals,
          market.quoteToken.decimals,
          market.teller,
          signer,
          {}
        );
      } catch (e) {
        console.log(e);
        // @ts-ignore
        throw Error(e);
      }
    },
    []
  );

  return {
    approveSpending,
    getMaxBondableAmount,
    getPayoutFor,
    getTokenAllowance,
    bond,
    estimateBond,
  };
};

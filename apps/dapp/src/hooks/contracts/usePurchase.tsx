import { Address, useAccount, useContractWrite, usePublicClient } from "wagmi";
import {
  estimateBondPayout,
  estimateBondPurchaseGas,
  getBaseTeller,
} from "@bond-protocol/contract-library";
import { parseUnits } from "viem";
import { CalculatedMarket } from "types";

type PurchaseArgs = {
  referrer?: Address;
  amountIn: number;
  amountOut: number;
  slippage: number;
};

const NULL_ADDRESS: Address = `0x${"0".repeat(40)}`;

export const usePurchase = (market: CalculatedMarket) => {
  const { abi } = getBaseTeller(market.teller as Address);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const contract = useContractWrite({
    abi,
    address: market.teller as Address,
    functionName: "purchase",
  });

  const write = async ({ slippage = 0, ...args }: PurchaseArgs) => {
    if (!address) throw new Error("Not Connected");

    const amountIn = parseUnits(
      args.amountIn.toFixed(market.quoteToken.decimals),
      market.quoteToken.decimals
    );

    const minAmountOut = args.amountOut - args.amountOut * (slippage / 100);

    const amountOut = parseUnits(
      minAmountOut.toFixed(market.payoutToken.decimals),
      market.payoutToken.decimals
    );

    const referrer = args.referrer ?? NULL_ADDRESS;

    return contract.write({
      args: [address, referrer, BigInt(market.marketId), amountIn, amountOut],
    });
  };

  const getPayoutFor = async ({
    amount,
    referrer,
  }: {
    amount: string;
    referrer?: Address;
  }) => {
    return estimateBondPayout({
      amount: parseUnits(amount, market.quoteToken.decimals),
      chainId: Number(market.chainId),
      marketId: market.marketId,
      referrerAddress: referrer ?? NULL_ADDRESS,
      publicClient,
    });
  };

  const estimateBondGas = async (
    amount: number,
    payout: string,
    slippage: number,
    referrerAddress: string
  ) => {
    const minimumOut = Number(payout) - Number(payout) * (slippage / 100);

    return estimateBondPurchaseGas({
      publicClient,
      referrerAddress: referrerAddress as Address,
      recipientAddress: address as Address,
      tellerAddress: market.teller as Address,
      marketId: market.marketId,
      amountIn: parseUnits(
        amount.toFixed(market.quoteToken.decimals),
        market.quoteToken.decimals
      ),
      amountOut: parseUnits(
        minimumOut.toFixed(market.payoutToken.decimals),
        market.payoutToken.decimals
      ),
    });
  };

  return {
    ...contract,
    write,
    getPayoutFor,
    getMaxBondableAmount,
    estimateBondGas,
  };
};

function getMaxBondableAmount(balance: string, maxAmountAccepted: string) {
  return Math.min(Number(balance), Number(maxAmountAccepted));
}

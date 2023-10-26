import { Address, useContractWrite } from "wagmi";
import { CalculatedMarket, slim } from "@bond-protocol/contract-library";
import { parseUnits } from "viem";

type UsePurchaseArgs = {
  tellerAddress: Address;
  chainId: number;
  market: CalculatedMarket;
};

type PurchaseArgs = {
  address: Address;
  referrer: Address;
  marketId: number;
  amountIn: number;
  slippage: number;
};

export const usePurchase = ({ tellerAddress, market }: UsePurchaseArgs) => {
  const { abi } = slim.getBaseTeller(tellerAddress);

  const contract = useContractWrite({
    abi,
    address: tellerAddress,
    functionName: "purchase",
  });

  const write = async ({ slippage = 0, ...args }: PurchaseArgs) => {
    const amountIn = parseUnits(
      args.amountIn.toFixed(market.quoteToken.decimals),
      market.quoteToken.decimals
    );

    const minAmountOut = args.amountIn - args.amountIn * (slippage / 100);
    const amountOut = parseUnits(
      minAmountOut.toFixed(market.payoutToken.decimals),
      market.payoutToken.decimals
    );

    return contract.write({
      args: [
        args.address,
        args.referrer,
        BigInt(args.marketId),
        amountIn,
        amountOut,
      ],
    });
  };

  return {
    ...contract,
    write,
  };
};

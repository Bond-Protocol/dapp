import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  estimateBondPayout,
  estimateBondPurchaseGas,
  getBaseTeller,
} from "@bond-protocol/contract-library";
import { parseUnits } from "viem";
import { CalculatedMarket } from "types";
import { clients } from "context/blockchain-provider";

type PurchaseArgs = {
  referrer?: Address;
  amountIn: number;
  amountOut: number;
  slippage?: number;
};

const NULL_ADDRESS: Address = `0x${"0".repeat(40)}`;

export const usePurchase = (market: CalculatedMarket, args: PurchaseArgs) => {
  const { abi } = getBaseTeller(market.teller as Address);
  const publicClient = clients[Number(market.chainId)];
  const { address, isConnected } = useAccount();

  const purchaseArgs = formatPurchaseArgs({ market, args, address: address! });

  const { config } = usePrepareContractWrite({
    abi,
    address: market.teller as Address,
    functionName: "purchase",
    chainId: Number(market.chainId),
    args: purchaseArgs,
    enabled: isConnected,
  });

  const contract = useContractWrite(config);

  const write = async () => {
    if (!address) throw new Error("Not Connected");

    return contract.writeAsync?.();
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

  const estimateBondGas = async (referrerAddress = NULL_ADDRESS) => {
    const [address, _referrer, marketId, amountIn, amountOut] = purchaseArgs;

    return estimateBondPurchaseGas({
      publicClient,
      referrerAddress: referrerAddress as Address,
      recipientAddress: address as Address,
      tellerAddress: market.teller as Address,
      marketId,
      amountIn,
      amountOut,
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

function formatPurchaseArgs({
  market,
  address,
  args,
}: {
  market: CalculatedMarket;
  args: PurchaseArgs;
  address: Address;
}): [Address, Address, bigint, bigint, bigint] {
  const amountIn = parseUnits(
    args.amountIn.toFixed(market.quoteToken.decimals),
    market.quoteToken.decimals
  );

  const minAmountOut =
    args.amountOut - args.amountOut * (args.slippage ?? 0.05 / 100);

  const amountOut = parseUnits(
    minAmountOut.toFixed(market.payoutToken.decimals),
    market.payoutToken.decimals
  );

  const referrer = args.referrer ?? NULL_ADDRESS;
  return [address, referrer, BigInt(market.marketId), amountIn, amountOut];
}

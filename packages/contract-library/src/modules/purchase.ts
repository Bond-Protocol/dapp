import { Address, PublicClient, getContract } from "viem";
import { getAggregator } from "core";
import { abis } from "abis";

export function estimateBondPayout({
  chainId,
  amount,
  publicClient,
  marketId,
  referrerAddress,
}: {
  chainId: number;
  amount: bigint;
  marketId: bigint | number;
  referrerAddress: Address;
  publicClient: PublicClient;
}) {
  const _marketId = BigInt(marketId);
  const aggregator = getAggregator(chainId);

  if (!aggregator.address) {
    throw new Error(`Unable to find Aggregator for ${marketId}`);
  }

  const contract = getContract({ ...aggregator, publicClient });

  return contract.read.payoutFor([amount, _marketId, referrerAddress]);
}

export type BondPurchaseArgs = {
  tellerAddress: Address;
  publicClient: PublicClient;
  recipientAddress: Address;
  referrerAddress: Address;
  marketId: number | bigint;
  amountIn: bigint;
  amountOut: bigint;
};

export function estimateBondPurchaseGas({
  tellerAddress,
  publicClient,
  recipientAddress,
  referrerAddress,
  marketId,
  amountIn,
  amountOut,
}: BondPurchaseArgs) {
  const abi = abis.baseTeller;

  return publicClient.estimateContractGas({
    address: tellerAddress,
    account: recipientAddress,
    abi,
    functionName: "purchase",
    args: [
      recipientAddress,
      referrerAddress,
      BigInt(marketId),
      amountIn,
      amountOut,
    ],
  });
}

export function formatPurchaseArgs({
  recipientAddress,
  referrerAddress,
  marketId,
  amountIn,
  amountOut,
}: {
  recipientAddress: Address;
  referrerAddress: Address;
  marketId: number | bigint;
  amountOut: bigint;
  amountIn: bigint;
}): readonly [Address, Address, bigint, bigint, bigint] {
  const id = BigInt(marketId);
  return [recipientAddress, referrerAddress, id, amountIn, amountOut];
}

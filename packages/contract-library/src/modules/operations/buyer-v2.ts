import { Address, PublicClient } from 'viem';
import { getBaseTeller, getTeller } from '../contract-helper-v2';

type PurchaseArgs = {
  publicClient: PublicClient;
  recipientAddress: string;
  referrer: string;
  id: bigint;
  amount: string;
  minAmountOut: string;
  payoutDecimals: number;
  quoteDecimals: number;
  tellerAddress: Address;
};

export async function purchase({
  publicClient,
  tellerAddress,
  ...args
}: PurchaseArgs) {
  const teller = getBaseTeller(publicClient, tellerAddress);

  const amount = Number(args.amount).toFixed(args.quoteDecimals);
  const minAmountOut = Number(args.minAmountOut).toFixed(args.payoutDecimals);
}

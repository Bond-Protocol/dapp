import { Address, PublicClient, WalletClient, parseUnits } from 'viem';
import { getBaseTeller, getTeller } from '../contract-helper-v2';

type PurchaseArgs = {
  walletClient: WalletClient;
  recipientAddress: Address;
  referrer: Address;
  id: bigint;
  amount: string;
  minAmountOut: string;
  payoutDecimals: number;
  quoteDecimals: number;
  tellerAddress: Address;
};

export async function purchase({
  walletClient,
  tellerAddress,
  ...args
}: PurchaseArgs) {
  const teller = getBaseTeller(walletClient, tellerAddress);

  const amount = parseUnits(args.amount, args.quoteDecimals);
  const minAmountOut = parseUnits(args.minAmountOut, args.payoutDecimals);

  const callArgs = [
    args.recipientAddress,
    args.referrer,
    args.id,
    amount,
    minAmountOut,
  ] as const;

  return teller.write.purchase(callArgs, {});
}

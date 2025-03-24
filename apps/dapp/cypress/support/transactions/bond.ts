import { Address } from "viem";
import { testAccount, testClient } from "../test-client";
import { abis, erc20ABI } from "@bond-protocol/contract-library";

const REFERRAL_ADDRESS = "0x007FEE34D1095C8b6bE44a9030bf6305EA366848";
const MARKET_ID = 3n;
const BOND_AMOUNT = 1000000000000000000000n;
const AMOUNT_OUT = 400000000000000000000n;

const TELLER = "0x007F774351e541b8bc720018De0796c4BF5afE3D";
const DEFAULT_ARGS = [
  testAccount.address,
  REFERRAL_ADDRESS,
  MARKET_ID,
  BOND_AMOUNT,
  AMOUNT_OUT,
] as const;

type BondArgs = {
  quoteTokenAddress: Address;
  decimals?: number;
};

export async function bond({ decimals = 18, ...args }: BondArgs) {
  const approve = await testClient.writeContract({
    abi: erc20ABI,
    functionName: "approve",
    address: args.quoteTokenAddress,
    args: [TELLER, BOND_AMOUNT],
  });

  await testClient.waitForTransactionReceipt({
    hash: approve,
  });

  const bond = await testClient.writeContract({
    address: TELLER,
    abi: abis.baseTeller,
    functionName: "purchase",
    args: DEFAULT_ARGS,
  });

  const receipt = await testClient.waitForTransactionReceipt({ hash: bond });

  const bondLogData = receipt.logs[4].data;

  //Extract the bond token id and amount from logs
  const bondId = BigInt(bondLogData.slice(0, 66));
  const amount = BigInt("0x" + bondLogData.slice(66));

  console.log(`Bonded ${amount} of tokenId ${bondId}`);
  return { bondId, amount };
}

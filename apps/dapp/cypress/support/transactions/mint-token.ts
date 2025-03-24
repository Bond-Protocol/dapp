import { Address, parseUnits } from "viem";
import { testClient } from "../test-client";
import { erc20ABI } from "@bond-protocol/contract-library";

type MintTokenArgs = {
  userAddress: Address;
  tokenAddress: Address;
  /**In decimal format*/
  amount: string;
  decimals?: number;
};
export const mintToken = async ({
  tokenAddress,
  userAddress,
  amount,
  decimals = 18,
}: MintTokenArgs) => {
  if (isNaN(+amount)) {
    throw new Error(`Invalid amount provided - ${amount} is NaN`);
  }

  const parsedAmount = parseUnits(amount, decimals);
  const hash = await testClient.writeContract({
    abi: erc20ABI,
    functionName: "mint",
    address: tokenAddress,
    args: [userAddress, parsedAmount],
  });

  return testClient.waitForTransactionReceipt({ hash });
};

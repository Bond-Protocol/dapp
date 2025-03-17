import { Hex } from "viem";
import { baseSepolia } from "viem/chains";
import { erc20ABI, erc20Bytecode } from "@bond-protocol/contract-library";
import { testClient } from "../test-client";

export const deployToken = async ({
  name,
  symbol,
}: {
  name: string;
  symbol: string;
}) => {
  const hash = await testClient.deployContract({
    abi: erc20ABI,
    bytecode: erc20Bytecode.object as Hex,
    args: [name, symbol, 18],
    chain: baseSepolia,
  });

  return testClient.waitForTransactionReceipt({
    hash,
  });
};

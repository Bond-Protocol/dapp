import { abis } from "@bond-protocol/contract-library";
import { environment } from "src/environment";
import { Address, getContract } from "viem";
import { PublicClient } from "wagmi";

export async function getTokenDetailsFromChain(
  address: Address,
  publicClient: PublicClient
) {
  const contract = getContract({
    abi: abis.erc20,
    address,
    publicClient,
  });

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
    ]);

    return { name, symbol, decimals };
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    throw Error(error);
  }
}

export async function getTokenDecimalsFromChain(
  address: Address,
  publicClient: PublicClient
) {
  try {
    const contract = getContract({
      abi: abis.erc20,
      address,
      publicClient,
    });

    return contract.read.decimals;
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    console.error("getTokenDecimalsFromChain", error, { address });
    if (!environment.isProduction) {
      return 0;
    }
  }
}

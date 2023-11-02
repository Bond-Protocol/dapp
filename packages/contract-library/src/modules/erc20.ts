import { Address, PublicClient, getContract } from "viem";
import { abis } from "..";

export function getBalance(
  tokenAddress: Address,
  holderAddress: Address,
  publicClient: PublicClient
) {
  const contract = getContract({
    abi: abis.erc20,
    address: tokenAddress,
    publicClient,
  });

  console.log({ contract, tokenAddress, publicClient });

  return contract.read.balanceOf([holderAddress]);
}

import { formatUnits } from "viem";
import { Address, erc20ABI, useContractRead } from "wagmi";

export function useBalance(args: {
  chainId: number;
  address?: Address;
  token: Address;
  tokenDecimals: number;
}) {
  const balance = useContractRead({
    abi: erc20ABI,
    chainId: args.chainId,
    address: args.token,
    functionName: "balanceOf",
    args: [args.address as Address],
    enabled: !!args.address && !!args.token,
  });

  return {
    ...balance,
    value: balance.data,
    formatted: formatUnits(balance.data ?? 0n, args.tokenDecimals),
  };
}

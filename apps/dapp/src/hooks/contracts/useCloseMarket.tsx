import { CalculatedMarket } from "types";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abis } from "@bond-protocol/contract-library";
import { useState } from "react";

export const useCloseMarket = (market: CalculatedMarket) => {
  const [hash, setHash] = useState<Address>();
  const tx = useWaitForTransaction({ hash });

  const { config } = usePrepareContractWrite({
    address: market.auctioneer as Address,
    abi: abis.baseAuctioneer,
    functionName: "closeMarket",
    args: [BigInt(market.marketId)],
  });

  const contract = useContractWrite(config);

  const execute = async () => {
    const data = await contract.writeAsync?.();
    console.log({ data });
    setHash(data?.hash);
    return data;
  };

  return {
    ...contract,
    execute,
    tx,
  };
};

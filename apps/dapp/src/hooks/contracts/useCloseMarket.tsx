import { CalculatedMarket } from "types";
import { Address, useContractWrite } from "wagmi";
import { abis } from "@bond-protocol/contract-library";

export const useCloseMarket = (market: CalculatedMarket) => {
  const contract = useContractWrite({
    address: market.auctioneer as Address,
    abi: abis.baseAuctioneer,
    functionName: "closeMarket",
  });

  const write = () => {
    return contract.write({
      args: [BigInt(market.marketId)],
    });
  };

  return {
    ...contract,
    write,
  };
};

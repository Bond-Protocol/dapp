import { getAuctioneerForCreate } from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/contract-library";
import { useContractWrite, useWalletClient } from "wagmi";

export type UseCreateMarketArgs = {
  bondType: BondType;
};

export const useCreateMarket = (args: UseCreateMarketArgs) => {
  const { data: walletClient } = useWalletClient();

  const { abi, address } = getAuctioneerForCreate(
    walletClient?.chain.id ?? 1,
    args.bondType
  );

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address,
    functionName: "createMarket",
  });

  const write = (args: any) => {
    contract.write();
  };

  return {
    ...contract,
    write,
  };
};

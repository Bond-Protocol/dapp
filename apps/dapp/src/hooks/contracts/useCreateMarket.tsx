import {
  encodeCreateMarketParams,
  getAuctioneerForCreate,
} from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/contract-library";
import { useContractWrite, useWalletClient } from "wagmi";

export type UseCreateMarketArgs = {
  bondType: BondType;
};

export const useCreateMarket = ({ bondType }: UseCreateMarketArgs) => {
  const { data: walletClient } = useWalletClient();

  const { abi, address } = getAuctioneerForCreate(
    walletClient?.chain.id ?? 1,
    bondType
  );

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address,
    functionName: "createMarket",
  });

  const write = (marketConfig: any) => {
    const parsedConfig = encodeCreateMarketParams(marketConfig, bondType);

    console.log({ parsedConfig });
    contract.write({ args: [parsedConfig] });
  };

  return {
    ...contract,
    write,
  };
};

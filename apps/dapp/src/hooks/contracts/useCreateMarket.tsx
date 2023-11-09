import {
  CHAIN_ID,
  encodeCreateMarketParams,
  getAuctioneerForCreate,
} from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/contract-library";
import { useContractWrite, useWalletClient } from "wagmi";
import {
  getBondType,
  useCreateMarket as useCreateMarketState,
} from "components/modules";

export type UseCreateMarketArgs = {
  bondType: BondType;
};

export const useCreateMarket = () => {
  const { data: walletClient } = useWalletClient();
  const [state] = useCreateMarketState();
  const bondType = getBondType(state);

  console.log({ bondType });

  const { abi, address } = getAuctioneerForCreate(
    walletClient?.chain.id ?? 42161,
    bondType
  );

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address,
    functionName: "createMarket",
  });

  const write = (marketConfig: any) => {
    console.log("hello?");
    const config = encodeCreateMarketParams(marketConfig, bondType);

    return contract.writeAsync({ args: [config] });
  };

  return {
    ...contract,
    write,
  };
};

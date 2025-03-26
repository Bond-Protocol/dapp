import {
  encodeCreateMarketParams,
  getAuctioneerForCreate,
} from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/types";
import { useContractWrite } from "wagmi";
import {
  getBondType,
  useCreateMarket as useCreateMarketState,
} from "components/modules";

export type UseCreateMarketArgs = {
  bondType: BondType;
};

export const useCreateMarket = () => {
  const [state] = useCreateMarketState();
  const bondType = getBondType(state);

  const { abi, address } = getAuctioneerForCreate(state.chainId, bondType);

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address,
    functionName: "createMarket",
  });

  const write = (marketConfig: any) => {
    const config = encodeCreateMarketParams(marketConfig, bondType);

    return contract.writeAsync({ args: [config] });
  };

  return {
    ...contract,
    write,
  };
};

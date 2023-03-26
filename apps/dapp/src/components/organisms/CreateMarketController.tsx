import { CreateMarketScreen } from "ui";
import { CreateMarketState } from "ui/dist/reducers/create-market";

export const CreateMarketController = () => {
  const getExchangeRate = () => 0.33;

  const onSubmit = (state: CreateMarketState, type: "wallet" | "multisig") => {
    console.log(`Deploy ${type}`, state);
  };

  return (
    <>
      <CreateMarketScreen
        onSubmit={(state) => onSubmit(state, "wallet")}
        onSubmitMultisig={(state) => onSubmit(state, "multisig")}
        getExchangeRate={getExchangeRate}
      />
    </>
  );
};

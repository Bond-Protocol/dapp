import { useState } from "react";
import { SelectModal } from "components/molecules/SelectModal";
import { SelectVestingDialog } from "components/modals/SelectVestingDialog";
import { PriceModelPicker } from "components/organisms/PriceModelPicker";
import {
  Button,
  FlatSelect,
  InputModal,
  TokenAmountInput,
  SelectTokenDialog,
  InfoLabel,
  SelectDateDialog,
} from "..";
import { vestingOptions } from "utils/options";
import { list as tokenList } from "utils/sample-tokens";

import { PlaceholderChart } from "components/charts/PlaceholderChar";
import {
  useCreateMarket,
  Action,
  CreateMarketState,
} from "../../reducers/create-market";

export type CreateMarketScreenProps = {
  a?: boolean;
  onSubmit: (state: CreateMarketState) => void;
  onSubmitMultisig: (state: CreateMarketState) => void;
};

const capacityOptions = [
  { label: "SELL", value: "payout" },
  { label: "BUY", value: "quote" },
];

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  const [index, setIndex] = useState(0);
  const [state, dispatch] = useCreateMarket((state) => {
    return { ...state, startDate: Date.now() };
  });

  const totalBonds = 100;
  const maxAmountInSingleTx = 42;

  const capacityToken =
    state.capacityType === "quote" ? state.quoteToken : state.payoutToken;

  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <div
          onClick={() => {
            dispatch({ type: Action.RESET });
            setIndex((i) => ++i);
          }}
          className="hover:text-light-secondary font-fraktion mr-2 cursor-pointer px-8 text-sm tracking-widest"
        >
          RESET
        </div>
      </div>
      <div key={index} id="cm-main-container" className="flex">
        <div id="cm-left-container" className="w-1/2 pr-2">
          <div className="flex">
            <div className="flex w-1/2 gap-x-2 pr-2">
              <InputModal
                label="Bond Token"
                title="Select token"
                value={state.payoutToken.symbol}
                icon={state.payoutToken.icon}
                ModalContent={(props) => (
                  <SelectTokenDialog {...props} tokens={tokenList} />
                )}
                onSubmit={({ value }) =>
                  dispatch({ type: Action.UPDATE_PAYOUT_TOKEN, value })
                }
              />
              <SelectModal
                label="Vesting"
                title="Custom Vesting"
                options={vestingOptions}
                defaultValue="7d"
                ModalContent={SelectVestingDialog}
                onSubmit={({ value }) =>
                  dispatch({ type: Action.UPDATE_VESTING, value })
                }
              />
            </div>
            <div className="w-1/2 pl-2">
              <InputModal
                label="Get Token"
                title="Select token"
                value={state.quoteToken.symbol}
                icon={state.quoteToken.icon}
                ModalContent={(props) => (
                  <SelectTokenDialog {...props} tokens={tokenList} />
                )}
                onSubmit={({ value }) =>
                  dispatch({ type: Action.UPDATE_QUOTE_TOKEN, value })
                }
              />
            </div>
          </div>
          <div className="flex gap-x-4 py-4">
            <TokenAmountInput
              label="Capacity"
              value={state.capacity}
              icon={capacityToken.icon}
              symbol={capacityToken.symbol}
              onChange={(value) =>
                dispatch({ type: Action.UPDATE_CAPACITY, value })
              }
            />
            <FlatSelect
              options={capacityOptions}
              onChange={(value) =>
                dispatch({ type: Action.UPDATE_CAPACITY_TYPE, value })
              }
            />
          </div>
          <PriceModelPicker
            payoutToken={state.payoutToken}
            quoteToken={state.quoteToken}
            onChange={(value) =>
              dispatch({ type: Action.UPDATE_PRICE_MODEL, value })
            }
            onRateChange={(value) => {
              dispatch({ type: Action.UPDATE_PRICE_RATES, value });
            }}
          />
        </div>
        <div
          id="cm-right-container"
          className="h-fill flex w-1/2 flex-col justify-between pl-2"
        >
          <div className="mt-2 flex h-full w-full">
            <PlaceholderChart />{" "}
          </div>
          <div className="flex gap-x-4">
            <InputModal
              label="Market Start Date"
              title="Select start date"
              defaultValue={{ value: state.startDate, label: "Today" }}
              ModalContent={SelectDateDialog}
            />
            <SelectModal
              label="Market Length"
              title="Set Market Length"
              options={vestingOptions}
              defaultValue="7d"
              ModalContent={SelectVestingDialog}
            />
          </div>
          <div className="mt-4 flex gap-x-4">
            <InfoLabel
              tooltip={`Maximum amount of ${
                capacityToken?.symbol || "the selected asset"
              } that can be purchased in a single transaction`}
              label={"Max Bond Size"}
              reverse
            >
              {maxAmountInSingleTx} {capacityToken?.symbol}
            </InfoLabel>
            <InfoLabel label={"Total Bonds Available"} reverse>
              {totalBonds}
            </InfoLabel>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-x-10">
        <Button
          onClick={() => props.onSubmitMultisig(state)}
          variant="ghost"
          size="lg"
          className="w-[308px]"
        >
          Get Multi-Sig Config
        </Button>
        <Button
          onClick={() => props.onSubmit(state)}
          size="lg"
          className="w-[308px]"
        >
          Deploy Market
        </Button>
      </div>
    </div>
  );
};

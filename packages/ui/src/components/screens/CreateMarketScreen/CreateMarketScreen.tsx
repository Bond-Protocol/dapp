import { useState } from "react";
import {
  Button,
  FlatSelect,
  InputModal,
  InfoLabel,
  SelectTokenDialog,
  SelectModal,
  SelectVestingDialog,
  SelectDateDialog,
  SelectEndDateDialog,
  PlaceholderChart,
  TokenAmountInput,
  Modal,
  Action,
  PriceModelPicker,
  ConfirmMarketCreationDialog,
  useCreateMarket,
} from "components";
import { ReactComponent as CalendarIcon } from "assets/icons/calendar-big.svg";
import { formatDate } from "utils";
import { vestingOptions } from "utils/options";
import { list as tokenList } from "utils/sample-tokens";

export type CreateMarketScreenProps = {
  onSubmit: () => void;
  onSubmitMultisig: () => void;
};

const capacityOptions = [
  { label: "SELL", value: "payout" },
  { label: "BUY", value: "quote" },
];

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useCreateMarket((initialState) => {
    return {
      ...initialState,
    };
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
            setIndex((i) => ++i); //TODO: (afx) :pepe_gun: but its valid react so
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
            onRateChange={(value) =>
              dispatch({ type: Action.UPDATE_PRICE_RATES, value })
            }
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
              value={
                state.startDate ? formatDate.dateAndTime(state.startDate) : ""
              }
              endAdornment={<CalendarIcon className="mr-2" />}
              ModalContent={(props) => <SelectDateDialog {...props} />}
              onSubmit={(value) =>
                dispatch({ type: Action.UPDATE_START_DATE, value })
              }
            />
            <InputModal
              label="Market End Date"
              title="Select end date"
              value={state.endDate ? formatDate.dateAndTime(state.endDate) : ""}
              endAdornment={<CalendarIcon className="mr-2" />}
              ModalContent={(props) => (
                <SelectEndDateDialog
                  {...props}
                  startDate={state.startDate ?? new Date()}
                />
              )}
              onSubmit={(value) =>
                dispatch({ type: Action.UPDATE_END_DATE, value })
              }
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
          onClick={() => {}}
          variant="ghost"
          size="lg"
          className="w-[308px]"
        >
          Get Multi-Sig Config
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          size="lg"
          className="w-[308px]"
        >
          Deploy Market
        </Button>
      </div>
      <Modal
        title="Confirm Market Creation"
        open={open}
        onClickClose={() => setOpen(false)}
      >
        <ConfirmMarketCreationDialog
          marketState={state}
          submitCreateMarketTransaction={props.onSubmit}
          submitApproveSpendingTransaction={props.onSubmitMultisig}
        />
      </Modal>
    </div>
  );
};

import { useEffect, useState } from "react";
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
  TokenInput,
  Modal,
  CreateMarketAction,
  PriceModelPicker,
  ConfirmMarketCreationDialog,
  useCreateMarket,
  ProjectionChart,
  CreateMarketState,
  Token,
  TransactionHashDialog,
  MarketCreatedDialog,
  PriceData,
  TooltipWrapper,
} from "components";
import { formatCurrency, formatDate, vestingOptions } from "utils";
import { ReactComponent as CalendarIcon } from "assets/icons/calendar-big.svg";

export type CreateMarketScreenProps = {
  projectionData: Array<PriceData>;
  fetchAllowance: (state: CreateMarketState) => Promise<any>;
  onSubmitAllowance: (state?: CreateMarketState) => void;
  onSubmitCreation: (state: CreateMarketState) => void;
  onSubmitMultisigCreation: (txHash: string) => void;
  getAuctioneer: (chain: string, state: CreateMarketState) => string;
  getTeller: (chain: string, state: CreateMarketState) => string;
  getTxBytecode: (state: CreateMarketState) => string;
  getApproveTxBytecode: (state: CreateMarketState) => string;
  estimateGas: (state: CreateMarketState) => string;
  chain: string;
  tokens: Token[];
  isAllowanceTxPending?: boolean;
  creationHash?: string;
  blockExplorerUrl: string;
  blockExplorerName: string;
  created: boolean;
};

const capacityOptions = [
  { label: "PAYOUT", value: "payout" },
  { label: "QUOTE", value: "quote" },
];

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  const chain = props.chain;

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [showMultisig, setShowMultisig] = useState(false);
  const [state, dispatch] = useCreateMarket();

  const capacityToken =
    state.capacityType === "quote" ? state.quoteToken : state.payoutToken;

  useEffect(() => {
    const fetchAllowance = async () => {
      const allowance = await props.fetchAllowance(state);
      dispatch({ type: CreateMarketAction.UPDATE_ALLOWANCE, value: allowance });
    };

    fetchAllowance();
  }, [state.payoutToken, state.priceModel, state.vestingType]);

  const canSubmit = //TODO: needs improvement
    parseFloat(state.capacity) > 0 &&
    state.endDate &&
    state.vesting &&
    state.quoteToken.address &&
    state.payoutToken.address;

  const buttons = (
    <>
      <Button
        id="cm-pre-submit-ms"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMultisig(true);
          setOpen(true);
        }}
        variant="ghost"
        disabled={!canSubmit}
        size="lg"
        className="mr-5 w-[308px]"
      >
        Get Multi-Sig Config
      </Button>
      <Button
        id="cm-pre-submit"
        disabled={!canSubmit}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMultisig(false);
          setOpen(true);
        }}
        size="lg"
        className="ml-5 w-[308px]"
      >
        Deploy Market
      </Button>
    </>
  );

  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <div
          onClick={() => {
            dispatch({ type: CreateMarketAction.RESET });
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
                id="cm-payout-token-picker"
                label="Payout Token"
                title="Select token"
                value={state.payoutToken.symbol}
                icon={state.payoutToken.icon}
                ModalContent={(modalProps) => (
                  <SelectTokenDialog
                    {...modalProps}
                    tokens={props.tokens}
                    chain={chain}
                  />
                )}
                onSubmit={({ value }) => {
                  dispatch({
                    type: CreateMarketAction.UPDATE_PAYOUT_TOKEN,
                    value,
                  });
                }}
              />

              <SelectModal
                id="cm-vesting-picker"
                label="Vesting"
                title="Custom Vesting"
                options={vestingOptions}
                ModalContent={SelectVestingDialog}
                onSubmit={({ value }) =>
                  dispatch({ type: CreateMarketAction.UPDATE_VESTING, value })
                }
              />
            </div>

            <div className="w-1/2 pl-2">
              <InputModal
                id="cm-quote-token-picker"
                label="Quote Token"
                title="Select token"
                value={state.quoteToken.symbol}
                icon={state.quoteToken.icon}
                ModalContent={(modalProps) => (
                  <SelectTokenDialog
                    {...modalProps}
                    tokens={props.tokens}
                    chain={chain}
                  />
                )}
                onSubmit={({ value }) =>
                  dispatch({
                    type: CreateMarketAction.UPDATE_QUOTE_TOKEN,
                    value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-x-4 py-4">
            <TokenInput
              id="cm-capacity-picker"
              label="Capacity"
              placeholder="Enter Amount"
              value={state.capacity}
              icon={capacityToken.icon}
              symbol={capacityToken.symbol}
              onChange={(value) =>
                dispatch({ type: CreateMarketAction.UPDATE_CAPACITY, value })
              }
            />

            <FlatSelect
              id="cm-capacity-type-picker"
              options={capacityOptions}
              onChange={(value) =>
                dispatch({
                  type: CreateMarketAction.UPDATE_CAPACITY_TYPE,
                  value,
                })
              }
            />
          </div>
          <PriceModelPicker
            id="cm-price-model-picker"
            payoutToken={state.payoutToken}
            quoteToken={state.quoteToken}
            onChange={(value) =>
              dispatch({ type: CreateMarketAction.UPDATE_PRICE_MODEL, value })
            }
            onRateChange={(value) =>
              dispatch({ type: CreateMarketAction.UPDATE_PRICE_RATES, value })
            }
          />
        </div>
        <div
          id="cm-right-container"
          className="h-fill flex w-1/2 flex-col justify-between pl-2"
        >
          <div className="mt-2 flex h-[290px] w-full">
            <ProjectionChart
              id="cm-projection-chart"
              targetDiscount={3}
              data={props.projectionData}
              initialPrice={Number(state.priceModels[state.priceModel].initialPrice) || 0}
              initialCapacity={Number(state.capacity) || 0}
              minPrice={Number(state.priceModels[state.priceModel].minPrice)}
              maxBondSize={Number(state.maxBondSize)}
              durationInDays={state.durationInDays}
              payoutTokenSymbol={state.payoutToken.symbol}
            />
          </div>
          <div className="flex gap-x-4">
            {state.priceModel === "dynamic" ? (
              <TooltipWrapper content="Dynamic market scheduling coming soon™">
                <InputModal
                  disabled
                  id="cm-start-date-picker"
                  label="Market Start"
                  value="Immediate"
                  inputClassName="text-light-grey"
                  endAdornment={<CalendarIcon className="mr-2 fill-white" />}
                  ModalContent={(props) => <SelectDateDialog {...props} />}
                  onSubmit={(value) =>
                    dispatch({
                      type: CreateMarketAction.UPDATE_START_DATE,
                      value,
                    })
                  }
                />
              </TooltipWrapper>
            ) : (
              <InputModal
                id="cm-start-date-picker"
                label="Market Start"
                title="Select start date"
                value={
                  state.startDate ? formatDate.dateAndTime(state.startDate) : ""
                }
                endAdornment={<CalendarIcon className="mr-2 fill-white" />}
                ModalContent={(props) => <SelectDateDialog {...props} />}
                onSubmit={(value) =>
                  dispatch({
                    type: CreateMarketAction.UPDATE_START_DATE,
                    value,
                  })
                }
              />
            )}
            <InputModal
              id="cm-end-date-picker"
              label="Market End"
              title="Select end date"
              value={state.endDate ? formatDate.dateAndTime(state.endDate) : ""}
              endAdornment={<CalendarIcon className="mr-2 fill-white" />}
              ModalContent={(props) => (
                <SelectEndDateDialog
                  {...props}
                  id="cm-end-date-dialog"
                  startDate={state.startDate ?? new Date()}
                />
              )}
              onSubmit={(value) =>
                dispatch({ type: CreateMarketAction.UPDATE_END_DATE, value })
              }
            />
          </div>
          <div className="mt-4 flex gap-x-4">
            {!state.durationInDays ? (
              <div
                className={`flex max-h-[104px] w-full justify-center bg-white/5 p-4 backdrop-blur-md`}
              >
                <div className="text-light-grey flex items-center justify-center py-4 text-sm">
                  <CalendarIcon className="fill-light-grey text-light-grey h-12 w-12 pr-2" />
                  Select dates to view market duration
                </div>
              </div>
            ) : (
              <>
                <InfoLabel
                  label={"Max Bond Size"}
                  reverse
                  symbol={capacityToken.symbol}
                  icon={capacityToken.icon}
                  editable={state.priceModel === "static"}
                  value={formatCurrency.trimToLengthSymbol(
                    state.overriden.maxBondSize
                      ? state.overriden.maxBondSize
                      : state.maxBondSize
                  )}
                  onChange={(value) =>
                    dispatch({
                      type: CreateMarketAction.OVERRIDE_MAX_BOND_SIZE,
                      value,
                    })
                  }
                />
                <InfoLabel label={"Market Length"} reverse>
                  {state.durationInDays} DAYS
                </InfoLabel>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-8 flex justify-center gap-x-10">{buttons}</div>
      <Modal
        title={
          props.created
            ? "Success!"
            : props.creationHash
            ? "Transaction Submitted"
            : showMultisig
            ? "Transaction Details"
            : "Confirm Market Creation"
        }
        open={open}
        onClickClose={() => setOpen(false)}
      >
        {props.created && <MarketCreatedDialog />}
        {!props.created && props.creationHash ? (
          <TransactionHashDialog
            key={index}
            blockExplorerUrl={props.blockExplorerUrl}
            blockExplorerName={props.blockExplorerName}
            hash={props.creationHash}
          />
        ) : (
          !props.created && (
            <ConfirmMarketCreationDialog
              showMultisig={showMultisig}
              chain={chain}
              hasAllowance={state.isAllowanceSufficient}
              isAllowanceTxPending={props.isAllowanceTxPending}
              submitCreateMarketTransaction={() =>
                props.onSubmitCreation(state)
              }
              submitApproveSpendingTransaction={() =>
                props.onSubmitAllowance(state)
              }
              submitMultisigCreation={props.onSubmitMultisigCreation}
              getAuctioneer={props.getAuctioneer}
              getTeller={props.getTeller}
              getTxBytecode={props.getTxBytecode}
              getApproveTxBytecode={props.getApproveTxBytecode}
              estimateGas={props.estimateGas}
            />
          )
        )}
      </Modal>
    </div>
  );
};

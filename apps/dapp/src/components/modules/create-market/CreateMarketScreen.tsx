import { useEffect, useState } from "react";
import {
  Button,
  FlatSelect,
  formatDate,
  InfoLabel,
  InputModal,
  MarketCreatedDialog,
  Modal,
  SelectDateDialog,
  SelectEndDateDialog,
  SelectModal,
  SelectStartDateDialog,
  SelectVestingDialog,
  TokenInput,
  TooltipWrapper,
  TransactionHashDialog,
  vestingOptions,
} from "ui";
import CalendarIcon from "assets/icons/calendar-big.svg?react";
import { SelectTokenController } from "components/organisms/SelectTokenController";
import { calculateTrimDigits, trimAsNumber } from "formatters";
import {
  CreateMarketAction as Action,
  CreateMarketState,
  PriceData,
  useCreateMarket,
  ProjectionChart,
  calculateDuration,
  ConfirmMarketCreationDialog,
  PriceModelPicker,
} from "./";
import { Address } from "viem";
import { Token } from "@bond-protocol/types";
import { getBlockExplorer } from "@bond-protocol/contract-library";
import { availableFixedExpiry } from "./config";

export type CreateMarketScreenProps = {
  projectionData: Array<PriceData>;
  fetchAllowance: (state: CreateMarketState) => Promise<any>;
  onSubmitAllowance: (state?: CreateMarketState) => void;
  onSubmitCreation: (state: CreateMarketState) => void;
  getAuctioneer: (chain: string, state: CreateMarketState) => Address;
  getTxBytecode: (state: CreateMarketState) => string;
  getApproveTxBytecode: (state: CreateMarketState) => string;
  estimateGas: (state: CreateMarketState) => Promise<string | undefined>;
  chain: string;
  tokens: Token[];
  isAllowanceTxPending?: boolean;
  creationHash?: string;
  blockExplorerUrl: string;
  blockExplorerName: string;
  created: boolean;
  oraclePrice: number;
  oracleMessage: string;
  isOracleValid: boolean;
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
  const [hasConfirmedStart, setHasConfirmedStart] = useState(false);

  const capacityToken =
    state.capacityType === "quote" ? state.quoteToken : state.payoutToken;

  const reset = () => {
    setHasConfirmedStart(false);
    dispatch({ type: Action.RESET });
    setIndex((i) => ++i); //TODO: (afx) :pepe_gun: but its valid react so
  };

  useEffect(() => {
    const fetchAllowance = async () => {
      const value = await props.fetchAllowance(state);
      dispatch({
        type: Action.UPDATE_ALLOWANCE,
        value,
      });
    };

    fetchAllowance();
  }, [state.payoutToken, state.priceModel, state.vestingType]);

  /*
    Ethereum Mainnet currently uses SDA v1 contracts, so start date is not supported.
    The v1.1 contracts have been deployed to Goerli, but we are using v1 there too for consistency.
  */
  const canSubmit =
    parseFloat(state.capacity) > 0 &&
    (hasConfirmedStart ||
      (state.priceModel === "dynamic" &&
        (Number(chain) === 1 || Number(chain) === 5))) &&
    state.endDate &&
    state.vesting &&
    state.quoteToken.address &&
    state.payoutToken.address &&
    (state.oracle ? props.isOracleValid : true);

  const updateMaxBond = (
    capacity?: any,
    durationInDays?: number,
    priceModel?: string
  ) => {
    let cap = Number(capacity);
    if (!cap) return 0;

    if (priceModel === "dynamic" || priceModel === "oracle-dynamic") {
      if (!durationInDays) return 0;

      let maxBondSize = cap / durationInDays;
      maxBondSize = trimAsNumber(
        maxBondSize,
        calculateTrimDigits(Number(maxBondSize))
      );

      dispatch({
        type: Action.OVERRIDE_MAX_BOND_SIZE,
        value: maxBondSize,
      });
    } else {
      dispatch({
        type: Action.OVERRIDE_MAX_BOND_SIZE,
        value: cap,
      });
    }
  };

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

  const txBlockExplorer = getBlockExplorer(state.chainId, "tx");

  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <div
          onClick={reset}
          className="mr-2 cursor-pointer font-fraktion text-base font-bold tracking-widest hover:text-light-secondary"
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
                icon={state.payoutToken.logoURI}
                ModalContent={(modalProps) => (
                  //@ts-ignore
                  <SelectTokenController
                    {...modalProps}
                    onSwitchChain={(value: string) => {
                      dispatch({
                        type: Action.UPDATE_CHAIN_ID,
                        value,
                      });
                    }}
                    tokens={props.tokens}
                    chainId={state.chainId}
                  />
                )}
                onSubmit={({ value }) => {
                  dispatch({
                    type: Action.UPDATE_PAYOUT_TOKEN,
                    value,
                  });
                }}
              />

              <SelectModal
                id="cm-vesting-picker"
                label="Vesting"
                title="Custom Vesting"
                options={vestingOptions}
                ModalContent={(props) => (
                  <SelectVestingDialog
                    {...props}
                    disableFixedExpiry={
                      !availableFixedExpiry.includes(state.chainId)
                    }
                  />
                )}
                onSubmit={({ value }) =>
                  dispatch({ type: Action.UPDATE_VESTING, value })
                }
              />
            </div>

            <div className="w-1/2 pl-2">
              <InputModal
                id="cm-quote-token-picker"
                label="Quote Token"
                title="Select token"
                value={state.quoteToken.symbol}
                icon={state.quoteToken.logoURI}
                ModalContent={(modalProps) => (
                  //@ts-ignore
                  <SelectTokenController
                    {...modalProps}
                    tokens={props.tokens}
                    onSwitchChain={(value: any) => {
                      dispatch({
                        type: Action.UPDATE_CHAIN_ID,
                        value,
                      });
                    }}
                    chainId={state.chainId}
                  />
                )}
                onSubmit={({ value }) =>
                  dispatch({
                    type: Action.UPDATE_QUOTE_TOKEN,
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
              icon={capacityToken.logoURI}
              symbol={capacityToken.symbol}
              onChange={(value) => {
                dispatch({ type: Action.UPDATE_CAPACITY, value });
                updateMaxBond(value, state.durationInDays, state.priceModel);
              }}
            />

            <FlatSelect
              id="cm-capacity-type-picker"
              options={capacityOptions}
              onChange={(value) =>
                dispatch({
                  type: Action.UPDATE_CAPACITY_TYPE,
                  value,
                })
              }
            />
          </div>
          {/* @ts-ignore */}
          <PriceModelPicker
            id="cm-price-model-picker"
            chain={state.chainId}
            payoutToken={state.payoutToken}
            quoteToken={state.quoteToken}
            oraclePrice={props.oraclePrice}
            oracleMessage={props.oracleMessage}
            isOracleValid={props.isOracleValid}
            onChange={(value: any) => {
              dispatch({ type: Action.UPDATE_PRICE_MODEL, value });
              updateMaxBond(
                state.capacity,
                state.durationInDays,
                value.priceModel
              );
            }}
            onRateChange={(value: any) => {
              dispatch({ type: Action.UPDATE_PRICE_RATES, value });
            }}
          />
        </div>
        <div
          id="cm-right-container"
          className="h-fill flex w-1/2 flex-col justify-between pl-2"
        >
          <div className="mt-2 flex h-[290px] w-full">
            <ProjectionChart
              data={props.projectionData}
              payoutTokenSymbol={state.payoutToken.symbol}
              quoteTokenSymbol={state.quoteToken.symbol}
              //@ts-ignore
              initialCapacity={Number(state.capacity) || 0}
              initialPrice={Number(
                state.priceModels[state.priceModel].initialPrice
              )}
              minPrice={Number(state.priceModels[state.priceModel].minPrice)}
              durationInDays={state.durationInDays}
              depositInterval={state.depositInterval}
              fixedDiscount={Number(
                state.priceModels[state.priceModel].fixedDiscount
              )}
              baseDiscount={Number(
                state.priceModels[state.priceModel].baseDiscount
              )}
              targetIntervalDiscount={Number(
                state.priceModels[state.priceModel].targetIntervalDiscount
              )}
              fixedPrice={Number(
                state.priceModels[state.priceModel].initialPrice
              )}
              maxDiscountFromCurrent={Number(
                state.priceModels[state.priceModel].maxDiscountFromCurrent
              )}
            />
          </div>
          <div className="flex gap-x-4">
            {state.priceModel === "dynamic" &&
            (Number(chain) === 1 || Number(chain) === 5 || !chain) ? (
              <TooltipWrapper content="Dynamic market start dates are currently unavailable in Ethereum Mainnet">
                <InputModal
                  disabled
                  id="cm-start-date-picker"
                  label="Market Start"
                  value="Immediate"
                  className="opacity-75"
                  inputClassName="text-light-grey cursor-not-allowed select-none"
                  endAdornment={
                    <CalendarIcon className="mr-2 cursor-not-allowed fill-white" />
                  }
                  ModalContent={(props) => <SelectDateDialog {...props} />}
                  onSubmit={() => {}}
                />
              </TooltipWrapper>
            ) : (
              <InputModal
                id="cm-start-date-picker"
                label="Market Start"
                title="Select start date"
                value={
                  state.startDate
                    ? formatDate.dateAndTime(state.startDate)
                    : hasConfirmedStart
                    ? "Immediate"
                    : ""
                }
                inputClassName="text-light-grey"
                endAdornment={<CalendarIcon className="mr-2 fill-white" />}
                ModalContent={(props) => (
                  <SelectStartDateDialog
                    {...props}
                    id="cm-start-date-dialog"
                    onConfirmImmediate={() => setHasConfirmedStart(true)}
                  />
                )}
                onSubmit={(value) => {
                  setHasConfirmedStart(true);
                  dispatch({
                    type: Action.UPDATE_START_DATE,
                    value,
                  });

                  const durationInDays = Math.ceil(
                    Number(calculateDuration(state.endDate, value)) /
                      60 /
                      60 /
                      24
                  );
                  if (durationInDays) {
                    updateMaxBond(
                      state.capacity,
                      durationInDays,
                      state.priceModel
                    );
                  }
                }}
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
              onSubmit={(value) => {
                dispatch({ type: Action.UPDATE_END_DATE, value });

                const durationInDays = Math.ceil(
                  Number(calculateDuration(value, state.startDate)) /
                    60 /
                    60 /
                    24
                );
                if (durationInDays) {
                  updateMaxBond(
                    state.capacity,
                    durationInDays,
                    state.priceModel
                  );
                }
              }}
            />
          </div>
          <div className="mt-4 flex flex-row-reverse gap-x-4">
            {!(state.durationInDays && state.capacity) ? (
              <div
                className={`flex max-h-[104px] justify-center bg-white/5 p-4 backdrop-blur-md ${
                  state.payoutToken.symbol &&
                  state.quoteToken?.symbol &&
                  state.priceModel === "oracle-dynamic"
                    ? "w-1/2"
                    : "w-full"
                }`}
              >
                <div className="flex items-center justify-center py-4 text-sm text-light-grey">
                  <CalendarIcon className="h-12 w-12 fill-light-grey pr-2 text-light-grey" />
                  Select capacity and dates to view market duration
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
                  value={state.maxBondSize}
                  onChange={(value) => {
                    if (!value) return;
                    dispatch({
                      type: Action.OVERRIDE_MAX_BOND_SIZE,
                      value,
                    });
                  }}
                />

                <InfoLabel
                  className={`${
                    state.priceModel === "oracle-dynamic" ? "invisible" : ""
                  }`}
                  label={"Market Length"}
                  reverse
                >
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
            blockExplorerUrl={txBlockExplorer.url}
            blockExplorerName={txBlockExplorer.name}
            hash={props.creationHash}
          />
        ) : (
          !props.created && (
            <ConfirmMarketCreationDialog
              showMultisig={showMultisig}
              hasAllowance={state.isAllowanceSufficient}
              isAllowanceTxPending={props.isAllowanceTxPending}
              submitCreateMarketTransaction={() =>
                props.onSubmitCreation(state)
              }
              submitApproveSpendingTransaction={() =>
                props.onSubmitAllowance(state)
              }
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

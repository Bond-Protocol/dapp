import {
  Button,
  Checkbox,
  Link,
  SummaryLabel,
  SummaryList,
  SummaryRow,
  Tooltip,
} from "ui";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { ReactComponent as Clipboard } from "assets/icons/copy-icon.svg";
import {
  calculateTrimDigits,
  dynamicFormatter,
  formatCurrency,
  formatDate,
  trim,
} from "formatters";
import fastVesting from "assets/icons/vesting/fast.svg";
import { useEffect, useState } from "react";
import { CHAINS } from "types";

import {
  CreateMarketAction,
  CreateMarketState,
  useCreateMarket,
} from "./create-market-reducer";
export const getBlockExplorer = (chainId: string, subpath = "") => {
  return {
    blockExplorerUrl: CHAINS.get(chainId)?.blockExplorerUrls[0].replace(
      "#",
      subpath
    ),
    blockExplorerName: CHAINS.get(chainId)?.blockExplorerName,
  };
};
const getDynamicPriceFields = (state: CreateMarketState) => {
  const tokenSymbols = `${state.quoteToken.symbol} PER ${state.payoutToken.symbol}`;

  const initialPrice = trim(
    state.priceModels[state.priceModel].initialPrice,
    calculateTrimDigits(state.priceModels[state.priceModel].initialPrice)
  );

  const minPrice = trim(
    state.priceModels[state.priceModel].minPrice,
    calculateTrimDigits(state.priceModels[state.priceModel].minPrice)
  );

  return [
    {
      leftLabel: "Initial Price",
      rightLabel: `${initialPrice} ${tokenSymbols}`,
    },
    {
      leftLabel: "Minimum Price",
      rightLabel: `${minPrice} ${tokenSymbols}`,
    },
  ];
};

const getStaticPriceFields = (state: CreateMarketState) => {
  const tokenSymbols = `${state.quoteToken.symbol} PER ${state.payoutToken.symbol}`;

  const fixedPrice = trim(
    state.priceModels[state.priceModel].fixedPrice,
    calculateTrimDigits(state.priceModels[state.priceModel].fixedPrice)
  );

  return [
    {
      leftLabel: "Fixed Price",
      rightLabel: `${fixedPrice} ${tokenSymbols}`,
    },
  ];
};

const getOracleDynamicPriceFields = (state: CreateMarketState) => {
  return [
    {
      leftLabel: "Base Discount",
      rightLabel: `${state.priceModels["oracle-dynamic"].baseDiscount}%`,
    },
    {
      leftLabel: "Target Interval Discount",
      rightLabel: `${state.priceModels["oracle-dynamic"].targetIntervalDiscount}%`,
    },
    {
      leftLabel: "Maximum Discount",
      rightLabel: `${state.priceModels["oracle-dynamic"].maxDiscountFromCurrent}%`,
    },
  ];
};

const getOracleStaticPriceFields = (state: CreateMarketState) => {
  return [
    {
      leftLabel: "Fixed Discount",
      rightLabel: `${state.priceModels["oracle-static"].fixedDiscount}%`,
    },
    {
      leftLabel: "Maximum Discount",
      rightLabel: `${state.priceModels["oracle-static"].maxDiscountFromCurrent}%`,
    },
  ];
};

const getPriceFields = (state: CreateMarketState) => {
  switch (state.priceModel) {
    case "dynamic":
      return getDynamicPriceFields(state);
    case "static":
      return getStaticPriceFields(state);
    case "oracle-dynamic":
      return getOracleDynamicPriceFields(state);
    case "oracle-static":
      return getOracleStaticPriceFields(state);
  }
};

const formatMarketState = (state: CreateMarketState) => {
  return {
    vesting: {
      icon: fastVesting,
      value: state.vestingString,
    },
    capacity: {
      icon:
        state.capacityType === "payout"
          ? state.payoutToken.logoURI
          : state.quoteToken.logoURI,
      symbol:
        state.capacityType === "payout"
          ? state.payoutToken.symbol
          : state.quoteToken.symbol,
      value: dynamicFormatter(state.capacity, false),
    },
    startDate: formatDate.short(state.startDate as Date),
    endDate: formatDate.short(state.endDate as Date),
    depositInterval: Math.round(state.depositInterval / 60 / 60) + " HOURS",
    debtBuffer: state.debtBuffer + "%",
    maxBondSize: formatCurrency.trimToLengthSymbol(state.maxBondSize),
  };
};

const Buttons = (props: {
  bytecode: string;
  address: string;
  disabled: boolean;
}) => {
  const copy = (content: string) => navigator.clipboard.writeText(content);

  return (
    <>
      <Button
        disabled={props.disabled}
        icon
        size="lg"
        className="group w-full"
        variant="ghost"
        onClick={() => copy(props.address)}
      >
        <div className="flex justify-around">
          COPY ADDRESS
          <Clipboard className="fill-white group-hover:fill-light-secondary" />
        </div>
      </Button>
      <Button
        disabled={props.disabled}
        size="lg"
        icon
        className="group w-full"
        onClick={() => copy(props.bytecode)}
      >
        <div className="flex justify-around">
          COPY BYTECODE
          <Clipboard className="fill-black" />
        </div>
      </Button>
    </>
  );
};

export const ConfirmMarketCreationDialog = (props: {
  showMultisig: boolean;
  chain: string;
  hasAllowance?: boolean;
  isAllowanceTxPending?: boolean;
  submitApproveSpendingTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitCreateMarketTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitMultisigCreation: (txHash: string) => void;
  getAuctioneer: (chain: string, state: CreateMarketState) => string;
  getTeller: (chain: string, state: CreateMarketState) => string;
  getTxBytecode: (state: CreateMarketState) => string;
  getApproveTxBytecode: (state: CreateMarketState) => string;
  estimateGas: (state: CreateMarketState) => string;
}) => {
  const [state, dispatch] = useCreateMarket();
  const auctioneer = props.getAuctioneer(props.chain, state);
  const teller = props.getTeller(props.chain, state);
  const formattedState = formatMarketState(state);
  const [accepted, setAccepted] = useState(false);
  const [gasEstimate, setGasEstimate] = useState("");

  const { blockExplorerUrl } = getBlockExplorer(props.chain, "address");

  const createMarketBytecode = props.getTxBytecode(state);
  const allowanceBytecode = props.getApproveTxBytecode(state);

  const fields = [
    { leftLabel: "Price Model", rightLabel: state.priceModel },
    ...getPriceFields(state),
    {
      leftLabel: "Max Bond Size",
      rightLabel:
        formattedState.maxBondSize + " " + formattedState.capacity.symbol,
    },
    {
      leftLabel: "Market Length",
      rightLabel: state.durationInDays.toString() + " DAYS",
    },
  ];

  const edited = state.overridden === true;
  const disabled = edited && !accepted;

  useEffect(() => {
    async function estimateGas() {
      const gasEstimate = await props.estimateGas(state);
      setGasEstimate(gasEstimate);
    }
    estimateGas();
  }, []);

  return (
    <div id="cm-confirm-modal">
      <div>
        <div>
          <h4 className="font-fraktion">SETUP</h4>
          <div className="grid grid-cols-[1fr_32px_1fr]">
            <SummaryLabel
              icon={state.payoutToken.logoURI}
              value={state.payoutToken.symbol}
              subtext="PAYOUT TOKEN"
            />
            <div className="flex items-center justify-center">
              <Arrow className="rotate-90" />
            </div>
            <SummaryLabel
              icon={state.quoteToken.logoURI}
              value={state.quoteToken.symbol}
              subtext="QUOTE TOKEN"
            />
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-x-8">
          <SummaryLabel
            icon={formattedState.vesting.icon}
            value={formattedState.vesting.value}
            subtext="VESTING"
          />

          <SummaryLabel
            icon={formattedState.capacity.icon}
            value={formattedState.capacity.value}
            subtext="CAPACITY"
          />
        </div>
        <h4 className="mt-4 font-fraktion">SCHEDULE</h4>
        <div className="grid grid-cols-[1fr_32px_1fr]">
          <SummaryLabel
            small
            value={
              formattedState.startDate !== "invalid"
                ? formattedState.startDate
                : "Immediate"
            }
            subtext="MARKET START DATE"
          />
          <div className="flex items-center justify-center">
            <Arrow className="rotate-90" />
          </div>
          <SummaryLabel
            small
            value={formattedState.endDate}
            subtext="MARKET END DATE"
          />
        </div>
      </div>
      {props.showMultisig && (
        <div className="mt-1">
          <SummaryRow
            editable={
              state.priceModel === "dynamic" ||
              state.priceModel === "oracle-dynamic"
            }
            leftLabel="Deposit Interval"
            rightLabel={formattedState.depositInterval}
            symbol=" HOURS"
            onChange={(value) => {
              if (!value) return;
              dispatch({
                type: CreateMarketAction.OVERRIDE_DEPOSIT_INTERVAL,
                value,
              });
            }}
          />
        </div>
      )}

      <h4 className="mt-4 font-fraktion">PRICING</h4>
      <SummaryList fields={fields} />
      {props.showMultisig && state.priceModel === "dynamic" && (
        <div className="mt-1">
          <SummaryRow
            editable={state.priceModel === "dynamic"}
            leftLabel="Debt Buffer"
            rightLabel={formattedState.debtBuffer}
            symbol="%"
            onChange={(value) => {
              if (!value) return;
              dispatch({
                type: CreateMarketAction.OVERRIDE_DEBT_BUFFER,
                value,
              });
            }}
          />
        </div>
      )}
      <div className="mt-1">
        <SummaryRow leftLabel="Gas Estimate" rightLabel={gasEstimate} />
      </div>

      {!props.showMultisig && (
        <div className="mt-4">
          {props.hasAllowance ? (
            <Button
              id="cm-confirm-modal-submit"
              size="lg"
              className="w-full"
              onClick={props.submitCreateMarketTransaction}
            >
              Deploy Market
            </Button>
          ) : (
            <Button
              size="lg"
              id="cm-confirm-modal-submit-allowance"
              className="w-full"
              disabled={props.isAllowanceTxPending}
              onClick={props.submitApproveSpendingTransaction}
            >
              <div className="flex justify-center">
                Approve capacity
                {props.isAllowanceTxPending ? (
                  <Tooltip content="Awaiting transaction confirmation">
                    <Timer className="ml-1" />{" "}
                  </Tooltip>
                ) : (
                  //TODO: Correct this
                  <Tooltip content="Teller contract needs to be allowed spending token to the total amount of configured capacity for market" />
                )}
              </div>
            </Button>
          )}
        </div>
      )}

      {props.showMultisig && edited && (
        <div className="mt-4 flex flex-col">
          <Checkbox
            onChange={setAccepted}
            labelClassname="font-bold"
            label="I understand"
          />
          <p className="mt-1 w-full max-w-[340px] self-center font-mono text-sm text-light-grey-400">
            You have edited advanced configuration. Make sure you are aware of
            their impact on the bond market.
          </p>
        </div>
      )}

      {props.showMultisig && (
        <div className="mt-4 flex gap-x-2">
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="whitespace-nowrap text-center font-fraktion text-2xl ">
              APPROVE CAPACITY
            </h4>
            <Link
              target="_blank"
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
              href={blockExplorerUrl + teller}
            >
              TELLER CONTRACT
            </Link>

            <Buttons
              disabled={disabled}
              bytecode={allowanceBytecode}
              address={state.payoutToken.address as string}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="text-center font-fraktion text-2xl ">
              DEPLOY MARKET
            </h4>
            <Link
              target="_blank"
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
              href={blockExplorerUrl + auctioneer}
            >
              AUCTION CONTRACT
            </Link>

            <Buttons
              disabled={disabled}
              bytecode={createMarketBytecode}
              address={auctioneer}
            />
          </div>
        </div>
      )}
    </div>
  );
};

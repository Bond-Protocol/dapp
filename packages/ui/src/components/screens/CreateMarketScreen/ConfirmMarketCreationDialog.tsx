import {
  Button,
  SummaryLabel,
  SummaryList,
  Tooltip,
  SummaryRow,
  Link,
  useCreateMarket,
  CreateMarketAction,
  Checkbox,
} from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { ReactComponent as Clipboard } from "assets/icons/copy-icon.svg";
import { CreateMarketState } from "components";
import { dynamicFormatter, formatDate } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";
import { CHAINS } from "@bond-protocol/bond-library/dist/src";
import { MouseEventHandler, useState } from "react";

const getDynamicPriceFields = (state: CreateMarketState) => {
  const tokenSymbols = `${state.quoteToken.symbol} PER ${state.payoutToken.symbol}`;
  return [
    {
      leftLabel: "Initial Price",
      rightLabel: `${state.priceModels.dynamic.initialPrice} ${tokenSymbols}`,
    },
    {
      leftLabel: "Minimum Price",
      rightLabel: `${state.priceModels.dynamic.minPrice} ${tokenSymbols}`,
    },
  ];
};

const getStaticPriceFields = (state: CreateMarketState) => {
  const tokenSymbols = `${state.quoteToken.symbol} PER ${state.payoutToken.symbol}`;
  return [
    {
      leftLabel: "Fixed Price",
      rightLabel: `${state.priceModels.static.initialPrice} ${tokenSymbols}`,
    },
  ];
};

const getPriceFields = (state: CreateMarketState) => {
  return state.priceModel === "dynamic"
    ? getDynamicPriceFields(state)
    : getStaticPriceFields(state);
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
          ? state.payoutToken.icon
          : state.quoteToken.icon,
      symbol:
        state.capacityType === "payout"
          ? state.payoutToken.symbol
          : state.quoteToken.symbol,
      value: dynamicFormatter(state.capacity, false),
    },
    startDate: formatDate.short(state.startDate as Date),
    endDate: formatDate.short(state.endDate as Date),
    depositInterval: state?.depositInterval / 60 / 60,
    debtBuffer: state.debtBuffer,
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
          <Clipboard className="group-hover:fill-light-secondary fill-white" />
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
  getAllowanceTxBytecode: (state: CreateMarketState) => string;
  estimateGas: (state: CreateMarketState) => string;
}) => {
  const [state, dispatch] = useCreateMarket();
  const auctioneer = props.getAuctioneer(props.chain, state);
  const teller = props.getTeller(props.chain, state);
  const formattedState = formatMarketState(state);
  const chain = CHAINS.get(props.chain);
  const blockExplorerUrl = chain?.blockExplorerUrls[0];
  const [accepted, setAccepted] = useState(false);

  const createMarketBytecode = props.getTxBytecode(state);
  const allowanceBytecode = props.getAllowanceTxBytecode(state);

  const fields = [
    { leftLabel: "Price Model", rightLabel: state.priceModel },
    ...getPriceFields(state),
    {
      leftLabel: "Max Bond Size",
      rightLabel: state.maxBondSize + " " + formattedState.capacity.symbol,
    },
    {
      leftLabel: "Market Length",
      rightLabel: state.durationInDays.toString() + " DAYS",
    },
  ];

  const edited = !!(
    state.overridenDebtBuffer || state.overridenDepositInterval
  );
  const disabled = edited && !accepted;

  return (
    <div id="cm-confirm-modal">
      <div>
        <div>
          <h4 className="font-fraktion">SETUP</h4>
          <div className="grid grid-cols-[1fr_32px_1fr]">
            <SummaryLabel
              icon={state.payoutToken.icon}
              value={state.payoutToken.symbol}
              subtext="PAYOUT TOKEN"
            />
            <div className="flex items-center justify-center">
              <Arrow className="rotate-90" />
            </div>
            <SummaryLabel
              icon={state.quoteToken.icon}
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
        <h4 className="font-fraktion mt-4">SCHEDULE</h4>
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
            editable
            leftLabel="Deposit Interval"
            rightLabel={formattedState.depositInterval?.toString()}
            symbol=" HOURS"
            onChange={(value) =>
              dispatch({
                type: CreateMarketAction.OVERRIDE_DEPOSIT_INTERVAL,
                value,
              })
            }
          />
        </div>
      )}
      <h4 className="font-fraktion mt-4">PRICING</h4>
      <SummaryList fields={fields} />
      {props.showMultisig && (
        <div className="mt-1">
          <SummaryRow
            editable
            leftLabel="Debt Buffer"
            rightLabel={formattedState.debtBuffer?.toString()}
            symbol="%"
            onChange={(value) =>
              dispatch({ type: CreateMarketAction.OVERRIDE_DEBT_BUFFER, value })
            }
          />
        </div>
      )}

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
          <p className="text-light-grey-400 mt-1 w-full max-w-[340px] self-center font-mono text-sm">
            You have edited advanced configuration. Make sure you are aware of
            their impact on the bond market.
          </p>
        </div>
      )}

      {props.showMultisig && (
        <div className="mt-4 flex gap-x-2">
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="font-fraktion whitespace-nowrap text-center text-2xl ">
              APPROVE CAPACITY
            </h4>
            <Link
              target="_blank"
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
              href={blockExplorerUrl + "address/" + teller}
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
            <h4 className="font-fraktion text-center text-2xl ">
              DEPLOY MARKET
            </h4>
            <Link
              target="_blank"
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
              href={blockExplorerUrl + "address/" + auctioneer}
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

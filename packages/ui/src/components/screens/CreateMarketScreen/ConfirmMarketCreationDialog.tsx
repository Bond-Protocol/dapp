import {
  Button,
  SummaryLabel,
  SummaryList,
  Tooltip,
  SummaryRow,
  Link,
} from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { ReactComponent as Clipboard } from "assets/icons/copy-icon.svg";
import { CreateMarketState } from "components";
import { dynamicFormatter, formatDate } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";
import { CHAINS } from "@bond-protocol/bond-library/dist/src";
import { MouseEventHandler } from "react";

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
    depositInterval: state.depositInterval,
    debtBuffer: state.debtBuffer,
  };
};

const Buttons = (props: { bytecode: string; address: string }) => {
  const copy = (content: string) => navigator.clipboard.writeText(content);

  return (
    <>
      <Button
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

export const ConfirmMarketCreationDialog = ({
  marketState,
  ...props
}: {
  marketState: CreateMarketState;
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
  estimateGas: (state: CreateMarketState) => string;
}) => {
  const chainName = CHAINS.get(props.chain)?.displayName;
  const bytecode = props.getTxBytecode(marketState);
  const auctioneer = props.getAuctioneer(props.chain, marketState);
  const teller = props.getTeller(props.chain, marketState);
  const formattedState = formatMarketState(marketState);

  const fields = [
    { leftLabel: "Price Model", rightLabel: marketState.priceModel },
    ...getPriceFields(marketState),
    {
      leftLabel: "Max Bond Size",
      rightLabel:
        marketState.maxBondSize + " " + formattedState.capacity.symbol,
    },
    {
      leftLabel: "Market Length",
      rightLabel: marketState.durationInDays.toString() + " DAYS",
    },
  ];

  return (
    <div id="cm-confirm-modal">
      <div>
        <div>
          <h4 className="font-fraktion">SETUP</h4>
          <div className="grid grid-cols-[1fr_32px_1fr]">
            <SummaryLabel
              icon={marketState.payoutToken.icon}
              value={marketState.payoutToken.symbol}
              subtext="PAYOUT TOKEN"
            />
            <div className="flex items-center justify-center">
              <Arrow className="rotate-90" />
            </div>
            <SummaryLabel
              icon={marketState.quoteToken.icon}
              value={marketState.quoteToken.symbol}
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
      {props.showMultisig && (
        <div className="mt-4 flex gap-x-2">
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="font-fraktion text-2xl">APPROVE CAPACITY</h4>
            <Link
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
            >
              TELLER CONTRACT
            </Link>

            <Buttons address={teller} />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="font-fraktion text-2xl">DEPLOY MARKET</h4>
            <Link
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
            >
              AUCTIONEER CONTRACT
            </Link>

            <Buttons bytecode={bytecode} address={auctioneer} />
          </div>
        </div>
      )}
    </div>
  );
};

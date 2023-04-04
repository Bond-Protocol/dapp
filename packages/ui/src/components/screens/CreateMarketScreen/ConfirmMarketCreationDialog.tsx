import { Button, SummaryLabel, InfoList, Tooltip } from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { CreateMarketState } from "components";
import { dynamicFormatter, formatDate } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";

const getDynamicPriceFields = (state: CreateMarketState) => {
  const initialPrice = dynamicFormatter(
    state.priceModels.dynamic.initialPrice,
    false
  );
  const minPrice = dynamicFormatter(state.priceModels.dynamic.minPrice, false);
  const tokenSymbols = `${state.payoutToken.symbol} PER ${state.quoteToken.symbol}`;
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
  const fixedPrice = dynamicFormatter(
    state.priceModels.static.initialPrice,
    false
  );
  const tokenSymbols = `${state.payoutToken.symbol} PER ${state.quoteToken.symbol}`;
  return [
    {
      leftLabel: "Fixed Price",
      rightLabel: `${fixedPrice} ${tokenSymbols}`,
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
      value: "7 DAYS",
    },
    capacity: {
      icon:
        state.capacityType === "payout"
          ? state.payoutToken.icon
          : state.quoteToken.icon,
      value: state.capacity,
    },

    startDate: formatDate.short(state.startDate as Date),
    endDate: formatDate.short(state.endDate as Date),
  };
};

export const ConfirmMarketCreationDialog = ({
  marketState,
  ...props
}: {
  marketState: CreateMarketState;
  hasAllowance?: boolean;
  isAllowanceTxPending?: boolean;
  submitApproveSpendingTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitCreateMarketTransaction: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const formattedState = formatMarketState(marketState);

  const fields = [
    { leftLabel: "Price Model", rightLabel: marketState.priceModel },
    ...getPriceFields(marketState),
    {
      leftLabel: "Max Bond Size",
      rightLabel: "100 OHM",
    },
    {
      leftLabel: "Total Max Bonds",
      rightLabel: "10",
    },
  ];

  return (
    <div className="text-fraktion">
      <div>
        <h4 className="font-fraktion">SETUP</h4>
        <div className="grid grid-cols-[1fr_32px_1fr]">
          <SummaryLabel
            icon={marketState.payoutToken.icon}
            value={marketState.payoutToken.symbol}
            subtext="BOND TOKEN"
          />
          <div className="flex items-center justify-center">
            <Arrow className="rotate-90" />
          </div>
          <SummaryLabel
            icon={marketState.quoteToken.icon}
            value={marketState.quoteToken.symbol}
            subtext="GET TOKEN"
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
          value={formattedState.startDate}
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
      <h4 className="font-fraktion mt-4">PRICING</h4>
      <InfoList fields={fields} />
      <div className="mt-4">
        {props.hasAllowance ? (
          <Button
            size="lg"
            className="w-full"
            onClick={props.submitCreateMarketTransaction}
          >
            Deploy Market
          </Button>
        ) : (
          <Button
            size="lg"
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
    </div>
  );
};

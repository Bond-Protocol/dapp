import {
  Button,
  SummaryLabel,
  InfoList,
  ButtonGroup,
  Tooltip,
} from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { CreateMarketState } from "components";
import { formatDate, longFormatter } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";

const getDynamicPriceFields = (state: CreateMarketState) => {
  const initialPrice = state.priceModels.dynamic.initialPrice;
  const minPrice = state.priceModels.dynamic.minPrice;
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
  const fixedPrice = state.priceModels.static.initialPrice;
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

const formatVesting = ({ vesting, vestingType }: CreateMarketState) => {
  return {
    icon: fastVesting,
    label: "7 DAYS",
  };
};

export const ConfirmMarketCreationDialog = ({
  marketState,
}: {
  marketState: CreateMarketState;
}) => {
  const formattedVesting = formatVesting(marketState);

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
          icon={formattedVesting.icon}
          value={formattedVesting.label}
          subtext="VESTING"
        />

        <SummaryLabel
          icon={
            marketState.capacityType === "payout"
              ? marketState.payoutToken.icon
              : marketState.quoteToken.icon
          }
          value={longFormatter.format(Number(marketState.capacity))}
          subtext="CAPACITY"
        />
      </div>
      <h4 className="font-fraktion mt-4">SCHEDULE</h4>
      <div className="grid grid-cols-[1fr_32px_1fr]">
        <SummaryLabel
          small
          value={formatDate.short(marketState.startDate as Date)}
          subtext="MARKET START DATE"
        />
        <div className="flex items-center justify-center">
          <Arrow className="rotate-90" />
        </div>
        <SummaryLabel
          small
          value={formatDate.short(marketState.endDate as Date)}
          subtext="MARKET END DATE"
        />
      </div>
      <h4 className="font-fraktion mt-4">PRICING</h4>
      <InfoList fields={fields} />
      <div className="">
        <Button size="lg" className="w-full">
          <div className="flex justify-center">
            Deploy
            <Tooltip content="ok" />
          </div>
        </Button>
      </div>
    </div>
  );
};

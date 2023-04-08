import {Button, SummaryLabel, InfoList, Tooltip, Icon, Input} from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { CreateMarketState } from "components";
import { formatDate } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";
import {CHAINS} from "@bond-protocol/bond-library/dist/src";
import copyIcon from "assets/icons/copy-icon.svg";
import {useState} from "react";
import {Copy} from "components/atoms/Copy";

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
  showMultisig: boolean;
  chain: string;
  hasAllowance?: boolean;
  isAllowanceTxPending?: boolean;
  submitApproveSpendingTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitCreateMarketTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitMultisigCreation: (txHash: string) => void;
  getTeller: (chain: string, state: CreateMarketState) => string;
  getTxBytecode: (state: CreateMarketState) => string;
}) => {
  const chainName = CHAINS.get(props.chain)?.displayName;
  const bytecode = props.getTxBytecode(marketState);
  const teller = props.getTeller(props.chain, marketState);
  const formattedState = formatMarketState(marketState)

  const [txHash, setTxHash] = useState("");

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

  const multisigFields = [
    { leftLabel: "Chain", rightLabel: chainName },
    {
      leftLabel: "Contract Address",
      rightLabel: teller,
      copy: teller
    },
    {
      leftLabel: "Payout Token",
      rightLabel: marketState.payoutToken.address,
      copy: marketState.payoutToken.address
    },
    {
      leftLabel: "Recommended Allowance",
      rightLabel: marketState.recommendedAllowanceDecimalAdjusted,
      copy: marketState.recommendedAllowanceDecimalAdjusted
    }
  ]

  return (
    <div>
      {!props.showMultisig ? (
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
      ) : (
        <div className="text-fraktion">
          <InfoList fields={multisigFields} />

          <div className="mt-1 text-sm font-extralight bg-white/5">
            <div className="flex flex-row mx-2">
              <h4 className="text-light-grey py-2.5 text-base font-light">Transaction Bytecode</h4>
              <Copy
                content={bytecode}
                iconWidth={13.3}
                iconClassname={"pb-[1px] ml-0.5 fill-light-secondary-10"}
              />
            </div>
            <p className="font-fraktion text-base uppercase text-white break-words mx-2 pb-4 text-xs">{bytecode}</p>
          </div>

          <div className="mt-5 px-2 text-sm justify-center font-extralight">
            After executing the transaction, enter the transaction hash below for final confirmation.
          </div>

          <Input
            label="Transaction Hash"
            className="my-2"
            onChange={(e) => setTxHash(e.target.value)}
          />

          <Button
            size="lg"
            className="w-full"
            onClick={() => props.submitMultisigCreation(txHash)}
          >
            Submit Tx Hash
          </Button>

          {!props.showMultisig && (
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
            )}
        </div>
      )}
    </div>
  );
};

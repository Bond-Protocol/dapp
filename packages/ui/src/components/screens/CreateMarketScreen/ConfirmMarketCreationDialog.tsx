import { Button, SummaryLabel, InfoList, Tooltip, Input } from "components";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "assets/icons/timer.svg";
import { CreateMarketState } from "components";
import { dynamicFormatter, formatDate } from "utils";
import fastVesting from "assets/icons/vesting/fast.svg";
import { CHAINS } from "@bond-protocol/bond-library/dist/src";
import { useEffect, useState } from "react";
import { Copy } from "components/atoms/Copy";

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
  getAuctioneer: (chain: string, state: CreateMarketState) => string;
  getTxBytecode: (state: CreateMarketState) => string;
  estimateGas: (state: CreateMarketState) => string;
}) => {
  const chainName = CHAINS.get(props.chain)?.displayName;
  const bytecode = props.getTxBytecode(marketState);
  const auctioneer = props.getAuctioneer(props.chain, marketState);
  const formattedState = formatMarketState(marketState);

  const [txHash, setTxHash] = useState("");
  const [gasEstimate, setGasEstimate] = useState<string>("Pending");

  useEffect(() => {
    const getGasEstimate = async () => {
      const estimate = await props.estimateGas(marketState);
      setGasEstimate(estimate);
    };

    getGasEstimate();
  }, []);

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
    {
      leftLabel: "Estimated Gas",
      rightLabel: gasEstimate,
    },
  ];

  const multisigFields = [
    { leftLabel: "Chain", rightLabel: chainName },
    {
      leftLabel: "Contract Address",
      rightLabel: auctioneer,
      copy: auctioneer,
    },
    {
      leftLabel: "Payout Token",
      rightLabel: marketState.payoutToken.address,
      copy: marketState.payoutToken.address,
    },
    {
      leftLabel: "Recommended Allowance",
      rightLabel: marketState.recommendedAllowanceDecimalAdjusted,
      copy: marketState.recommendedAllowanceDecimalAdjusted,
    },
    {
      leftLabel: "Estimated Gas",
      rightLabel: gasEstimate,
    },
  ];

  return (
    <div id="cm-confirm-modal">
      {!props.showMultisig ? (
        <div className="text-fraktion">
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
          <h4 className="font-fraktion mt-4">PRICING</h4>
          <InfoList fields={fields} />
          <div className="mt-4">
            {props.hasAllowance ? (
              <Button
                size="lg"
                id="cm-confirm-modal-submit"
                className="w-full"
                onClick={props.submitCreateMarketTransaction}
              >
                Deploy Market
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full"
                id="cm-confirm-modal-allowance"
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

          <div className="mt-1 bg-white/5 text-sm font-extralight">
            <div className="mx-2 flex flex-row">
              <h4 className="text-light-grey py-2.5 text-base font-light">
                Transaction Bytecode
              </h4>
              <Copy
                content={bytecode}
                iconWidth={13.3}
                iconClassname={"pb-[1px] ml-0.5 fill-light-secondary-10"}
              />
            </div>
            <p className="font-fraktion mx-2 break-words pb-4 text-xs uppercase text-white">
              {bytecode}
            </p>
          </div>

          <div className="mt-5 justify-center px-2 text-sm font-extralight">
            After executing the transaction, enter the transaction hash below
            for final confirmation.
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
        </div>
      )}
    </div>
  );
};

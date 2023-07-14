import { Button, Link, SummaryLabel, SummaryList, Tooltip } from "ui";
import { ReactComponent as Arrow } from "ui/assets/icons/arrow-icon.svg";
import { ReactComponent as Timer } from "ui/assets/icons/timer.svg";
import { ReactComponent as Clipboard } from "ui/assets/icons/copy-icon.svg";
import { dynamicFormatter, formatDate } from "ui";
import { useEffect, useMemo, useState } from "react";
import { getBlockExplorer } from "@bond-protocol/contract-library";
import { CreateAuctionState, useCreateAuction } from "./create-auction-reducer";

const formatAuctionState = (state: CreateAuctionState) => {
  return {
    capacity:
      dynamicFormatter(state.capacity, false) + " " + state.payoutToken.symbol,

    startDate: formatDate.short(state.startDate as Date),
    endDate: formatDate.short(state.endDate as Date),
    lastCancel: formatDate.short(state.lastCancel),
    fundingThreshold:
      dynamicFormatter(state.fundingThreshold, false) +
      " " +
      state.quoteToken.symbol,
  };
};

const Buttons = (props: {
  bytecode: string;
  address: string;
  disabled?: boolean;
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

export const ConfirmAuctionCreationDialog = (props: {
  showMultisig?: boolean;
  chain: string;
  hasAllowance?: boolean;
  isAllowanceTxPending?: boolean;
  submitApproveSpendingTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitCreateMarketTransaction: React.MouseEventHandler<HTMLButtonElement>;
  submitMultisigCreation: (txHash: string) => void;
  getAuctioneer: (chain: string, state: CreateAuctionState) => string;
  getTeller: (chain: string, state: CreateAuctionState) => string;
  getTxBytecode: (state: CreateAuctionState) => string;
  getApproveTxBytecode: (state: CreateAuctionState) => string;
  estimateGas: (state: CreateAuctionState) => string;
}) => {
  const [state, dispatch] = useCreateAuction();
  const auctioneer = props.getAuctioneer(props.chain, state);
  const teller = props.getTeller(props.chain, state);
  const formattedState = formatAuctionState(state);
  const [gasEstimate, setGasEstimate] = useState("");

  const { blockExplorerUrl } = getBlockExplorer(props.chain, "address");

  const createMarketBytecode = props.getTxBytecode(state);
  const allowanceBytecode = props.getApproveTxBytecode(state);

  const fields = useMemo(
    () => [
      {
        leftLabel: "Min Bid",
        rightLabel: state.minBid.toString() + " " + state.quoteToken.symbol,
      },
      {
        leftLabel: "Last Cancel",
        rightLabel: formattedState.lastCancel.toString(),
      },
      {
        leftLabel: "Gas Estimate",
        rightLabel: gasEstimate,
      },
    ],
    [state, gasEstimate]
  );

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
          <div className="mt-1 grid grid-cols-2 gap-x-8">
            <SummaryLabel
              value={formattedState.fundingThreshold}
              icon={state.quoteToken?.logoURI}
              subtext="FUNDING THRESHOLD"
            />

            <SummaryLabel
              icon={state.payoutToken?.logoURI}
              value={formattedState.capacity}
              subtext="CAPACITY"
            />
          </div>
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

      <h4 className="mt-4 font-fraktion">DETAILS</h4>
      <SummaryList fields={fields} />

      {!props.showMultisig && (
        <div className="mt-4">
          {props.hasAllowance ? (
            <Button
              id="cm-confirm-modal-submit"
              size="lg"
              className="w-full"
              onClick={props.submitCreateMarketTransaction}
            >
              Deploy Auction
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
              bytecode={allowanceBytecode}
              address={state.payoutToken.address as string}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <h4 className="text-center font-fraktion text-2xl ">
              DEPLOY AUCTION
            </h4>
            <Link
              target="_blank"
              labelClassname="text-light-grey hover:text-light-secondary"
              className="mb-2 font-mono"
              href={blockExplorerUrl + auctioneer}
            >
              AUCTION CONTRACT
            </Link>

            <Buttons bytecode={createMarketBytecode} address={auctioneer} />
          </div>
        </div>
      )}
    </div>
  );
};

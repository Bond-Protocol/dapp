import { ButtonGroup } from "../../components/molecules/ButtonGroup";
import { Checkbox, Link, SummaryLabel } from "../../components/atoms";
import Arrow from "../../assets/icons/arrow-icon.svg?react";
import { SummaryList, SummaryRow } from "../molecules";
import { useState } from "react";
import { CalculatedMarket } from "@bond-protocol/types";
import { formatCurrency } from "formatters";

export type PurchaseConfirmDialogProps = {
  amount?: string;
  payout?: string;
  vestingTime?: string;
  contract?: string;
  networkFee?: string;
  market: CalculatedMarket;
  onSubmit: () => void;
  onCancel: () => void;
};

const warning =
  " This market is currently priced at a premium, it is cheaper to buy on the open market. We recommend you buy elsewhere, or wait until the price drops on BondProtocol.";
const unknownWarning =
  " We cannot calculate a discount for this market as we are missing price data for one or both of the tokens. Please double check you wish to purchase at this price before continuing. ";

export const PurchaseConfirmDialog = ({
  vestingTime = "?",
  amount = "0",
  payout = "0",
  contract = "",
  onCancel,
  onSubmit,
  market,
  ...props
}: PurchaseConfirmDialogProps) => {
  const [accepted, setAccepted] = useState(false);

  const fields = [
    {
      leftLabel: "Network fee",
      tooltip: "An estimation of how much gas the transaction will consume",
      rightLabel: props.networkFee,
    },
    {
      leftLabel: "Auction contract",
      rightLabel: "View on " + market.blockExplorer.name,
      link: `${market.blockExplorer.url}/${market.auctioneer}`,
    },
    {
      leftLabel: "Teller contract",
      rightLabel: "View on " + market.blockExplorer.name,
      link: `${market.blockExplorer.url}/${market.teller}`,
    },
  ];

  const hasWarning = market.discount < 0 || isNaN(market.discount);

  const cantSubmit = hasWarning && !accepted;
  const formattedAmount = `${formatCurrency.trimToken(amount)} ${
    market.quoteToken.symbol
  }`;

  const formattedPayout = `${Number(payout).toFixed(4)} ${
    market.payoutToken.symbol
  }`;

  return (
    <div className="mt-4 text-center text-[15px] font-light">
      <div>
        <div className="grid grid-cols-[auto_32px_auto]">
          <SummaryLabel
            icon={market.quoteToken.logoURI}
            value={formattedAmount}
            subtext="You Bond"
            className="uppercase"
          />
          <div className="flex items-center justify-center">
            <Arrow className="rotate-90" />
          </div>
          <SummaryLabel
            icon={market.payoutToken.logoURI}
            value={formattedPayout}
            subtext="You Get"
            className="uppercase"
          />
        </div>
        <SummaryRow
          className="mt-2"
          leftLabel="Vested in"
          rightLabel={vestingTime}
        />
        <h4 className="font-fraktion mt-2 text-left">DETAILS</h4>
        <SummaryList fields={fields} />
      </div>
      {hasWarning && (
        <div className="m-4 text-left font-mono text-sm ">
          <div className="text-red-500">
            {market.discount < 0 && <p> {warning} </p>}
            {isNaN(market.discount) && <p>{unknownWarning}</p>}
          </div>
          <Checkbox
            data-testid="bond-warning-checkbox"
            onChange={(value) => setAccepted(value)}
            className="mt-1"
            label="I understand"
          />
        </div>
      )}

      <p className="text-light-secondary-30 mt-2 text-left">
        This transaction cannot be undone.
      </p>
      <ButtonGroup
        className="mt-6"
        leftLabel="Cancel"
        rightLabel="Confirm Bond"
        onClickLeft={onCancel}
        onClickRight={onSubmit}
        disabled={cantSubmit}
        data-testid="bond-confirm-button"
      />
    </div>
  );
};

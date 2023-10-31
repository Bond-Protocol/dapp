import { ButtonGroup } from "components/molecules/ButtonGroup";
import { Checkbox, Link, SummaryLabel } from "components/atoms";
import { ReactComponent as Arrow } from "assets/icons/arrow-icon.svg";
import { SummaryList, SummaryRow } from "../molecules";
import { useState } from "react";

export type PurchaseConfirmDialogProps = {
  issuer?: string;
  amount?: string;
  payout?: string;
  discount?: number;
  vestingTime?: string;
  contract?: string;
  tellerAddress: string;
  auctioneerAddress: string;
  blockExplorerName: string;
  blockExplorerURL: string;
  payoutLogo?: string;
  quoteLogo?: string;
  networkFee?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const warning =
  " This market is currently priced at a premium, it is cheaper to buy on the open market. We recommend you buy elsewhere, or wait until the price drops on BondProtocol.";
const unknownWarning =
  " We cannot calculate a discount for this market as we are missing price data for one or both of the tokens. Please double check you wish to purchase at this price before continuing. ";

export const PurchaseConfirmDialog = ({
  issuer,
  vestingTime = "?",
  amount = "0",
  payout = "0",
  discount = 0,
  contract = "",
  onCancel,
  onSubmit,
  blockExplorerURL,
  blockExplorerName,
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
      rightLabel: "View on " + blockExplorerName,
      link: `${blockExplorerURL}/${props.auctioneerAddress}`,
    },
    {
      leftLabel: "Teller contract",
      rightLabel: "View on " + blockExplorerName,
      link: `${blockExplorerURL}/${props.tellerAddress}`,
    },
  ];

  const hasWarning = discount < 0 || isNaN(discount);

  const cantSubmit = hasWarning && !accepted;

  return (
    <div className="mt-4 text-center text-[15px] font-light">
      <div>
        <div className="grid grid-cols-[auto_32px_auto]">
          <SummaryLabel
            icon={props.quoteLogo}
            value={amount}
            subtext="You Bond"
            className="uppercase"
          />
          <div className="flex items-center justify-center">
            <Arrow className="rotate-90" />
          </div>
          <SummaryLabel
            icon={props.payoutLogo}
            value={payout}
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
            {discount < 0 && <p> {warning} </p>}
            {isNaN(discount) && <p>{unknownWarning}</p>}
          </div>
          <Checkbox
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
      />
    </div>
  );
};

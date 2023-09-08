import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useState } from "react";
import {
  ActionInfoList,
  ButtonGroup,
  Checkbox,
  formatDate,
  SummaryLabel,
  SummaryRow,
  Switch,
} from "ui";

export type LimitOrderConfirmationDialogProps = {
  market: CalculatedMarket;
  payout?: string;
  amountIn: string;
  expiry: Date;
  orderContract?: string;
};

export const LimitOrderConfirmationDialog = (
  props: LimitOrderConfirmationDialogProps
) => {
  const [autoCancel, setAutoCancel] = useState(true);

  const fields = [
    {
      leftLabel: "Min amount to receive",
      rightLabel: props.payout,
      tooltip: "Only if bid is successful",
    },
    {
      leftLabel: "Order Expires on",
      rightLabel: formatDate.short(props.expiry),
    },
    { leftLabel: "Max Fee", tooltip: "", rightLabel: 1 },
    {
      leftLabel: "Limit Order contract",
      rightLabel: `View on ${props.market.blockExplorerName}`,
      link: `${props.market.blockExplorerUrl}${props.orderContract}}`,
    },
  ];

  return (
    <div className="text-[15px] font-light">
      <div>
        <span className="text-left font-fraktion uppercase">Limit Order</span>
        <div className="grid grid-cols-[1fr_32px_1fr]">
          <SummaryLabel
            icon={props.market.quoteToken.logoURI}
            value={`${props.payout} ${props.market.payoutToken.symbol}`}
            subtext="You Bond"
            className="uppercase"
          />
          <div className="flex items-center justify-center">@</div>
          <SummaryLabel
            value={props.amountIn}
            subtext="Limit Price"
            className="uppercase"
          />
        </div>

        <SummaryRow
          className="mt-1"
          leftLabel="You will get"
          rightLabel={props.payout}
        />

        <SummaryRow
          className="mt-1"
          leftLabel="Vested in"
          rightLabel={props.market.formattedShortVesting}
        />

        <h4 className="mt-2 text-left font-fraktion">DETAILS</h4>
        <ActionInfoList fields={fields} />
      </div>
      <div className="mt-2 bg-white/5 px-2 py-1.5">
        <Switch
          defaultChecked={autoCancel}
          onClick={() => setAutoCancel((prev) => !prev)}
          labelClassName="text-white/90 font-semibold"
          label="Auto-cancel order in extreme market conditions"
        />
        {!autoCancel && (
          <div className="mt-2">
            <Checkbox label="I undertand" />
            <p className="mt-1 w-[380px] pl-6 font-mono text-sm leading-none text-light-grey">
              By disabling auto-cancel, I understand that my order will execute
              if market price is below limit price
            </p>
          </div>
        )}
      </div>
      <div className="mt-1 text-sm text-light-grey-500">
        You can cancel orders at any time in the "Orders" tab.
      </div>
      <ButtonGroup
        className="mt-4"
        leftLabel="Cancel"
        rightLabel="Place Order"
        onClickLeft={() => {}}
        onClickRight={() => {}}
      />
    </div>
  );
};

import { CalculatedMarket } from "types";
import { socials } from "components/common";
import { formatDistanceToNowStrict } from "date-fns";
import { useMemo } from "react";
import {
  ActionInfoList,
  ButtonGroup,
  formatCurrency,
  formatDate,
  SummaryLabel,
  SummaryRow,
  trimToken,
} from "ui";
import { useAuth } from "./use-auth";
import { useLimitOrderForMarket } from "./use-limit-order";
import { ReactComponent as Timer } from "assets/icons/timer.svg";

export type LimitOrderConfirmationDialogProps = {
  market: CalculatedMarket;
  payout?: string;
  amountIn: string;
  limitPrice: string;
  expiry: Date;
  orderContract?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const TokenAmountLabel = ({
  amount,
  symbol,
  icon,
}: {
  amount: any;
  symbol: string;
  icon?: string;
}) => {
  return (
    <div className="flex items-center">
      {formatCurrency.amount(amount)}
      <div className="mx-1">
        <img width={16} height={16} src={icon} />
      </div>
      {symbol}
    </div>
  );
};

export const ApprovingLabel = () => {
  return (
    <div className="flex w-full justify-center">
      Pending
      <Timer width={32} />
    </div>
  );
};

export const LimitOrderConfirmationDialog = (
  props: LimitOrderConfirmationDialogProps
) => {
  //const [autoCancel, setAutoCancel] = useState(true);
  const order = useLimitOrderForMarket();
  const auth = useAuth();

  const needsApprove = !order.allowance.hasSuffiencentAllowanceForNextOrder;

  const fields = useMemo(
    () => [
      {
        leftLabel: "Min amount to receive",
        rightLabel: (
          <TokenAmountLabel
            amount={order.payout ?? 0}
            symbol={props.market.payoutToken.symbol}
            icon={props.market.payoutToken.logoURI}
          />
        ),
        tooltip: "Only if bid is successful",
      },
      {
        leftLabel: "Order Expires on",
        rightLabel: order.expiry ? formatDate.short(order.expiry) : "",
      },
      {
        leftLabel: "Max Fee",
        editable: true,
        onChange: (value: string) => order.setMaxFee(Number(value)),
        symbol: props.market.quoteToken.symbol,
        logoURI: props.market.quoteToken.logoURI,
        rightLabel: order.maxFee,
        tooltip:
          "This is the maximum amount of fees you will pay for this order. The executor will try to reduce this amount as much as possible.",
      },
      {
        leftLabel: "Limit Order contract",
        rightLabel: `View on ${props.market.blockExplorer.name}`,
        link: `${props.market.blockExplorer.url} ${props.orderContract}}`,
      },
    ],
    [props.market, order.maxFee, order.payout, order.expiry]
  );

  const formattedPrice = trimToken(Number(order.amount) / Number(order.payout));
  const endDate = new Date(props.market.vesting * 1000);
  const formattedVesting = props.market.vestingType.includes("expiration")
    ? formatDistanceToNowStrict(endDate, { unit: "day" })
    : props.market.formatted.shortVesting;

  return (
    <div className="text-[15px] font-light">
      <div>
        <span className="text-left font-fraktion uppercase">Limit Order</span>
        <div className="grid grid-cols-[auto_32px_auto]">
          <SummaryLabel
            icon={props.market.quoteToken.logoURI}
            value={`${formatCurrency.amount(order.amount ?? 0)}`}
            subtext="You Bond"
            className="uppercase"
          />
          <div className="flex items-center justify-center">@</div>
          <SummaryLabel
            value={`${formattedPrice} ${props.market.quoteToken.symbol}/${props.market.payoutToken.symbol}`}
            subtext="Limit Price"
            className="uppercase"
          />
        </div>

        <SummaryRow
          className="mt-1"
          leftLabel="You will get"
          rightLabel={
            <TokenAmountLabel
              amount={order.payout ?? 0}
              icon={props.market.payoutToken.logoURI}
              symbol={props.market.payoutToken.symbol}
            />
          }
        />

        <SummaryRow
          className="mt-1"
          leftLabel="Vested in"
          rightLabel={formattedVesting}
        />

        <h4 className="mt-2 text-left font-fraktion">DETAILS</h4>
        <ActionInfoList fields={fields} />
      </div>
      {/* <div className="mt-2 bg-white/5 px-2 py-1.5"> */}
      {/*   <Switch */}
      {/*     defaultChecked={autoCancel} */}
      {/*     onClick={() => setAutoCancel((prev) => !prev)} */}
      {/*     labelClassName="text-white/90 font-semibold" */}
      {/*     label="Auto-cancel order in extreme market conditions" */}
      {/*   /> */}
      {/*   {!autoCancel && ( */}
      {/*     <div className="mt-2"> */}
      {/*       <Checkbox label="I undertand" /> */}
      {/*       <p className="mt-1 w-[380px] pl-6 font-mono text-sm leading-none text-light-grey"> */}
      {/*         By disabling auto-cancel, I understand that my order will execute */}
      {/*         if market price is below limit price */}
      {/*       </p> */}
      {/*     </div> */}
      {/*   )} */}
      {/* </div> */}

      {!order.maxFee && (
        <div className="mx-auto mt-1 max-w-[360px] text-center text-xs text-light-alert opacity-80">
          Looks like we're currently unable to estimate the max fee, you may set
          it manually above or wait for the system to resume. If this persists
          for long, try reaching out in our{" "}
          <a className="cursor-pointer text-white" href={socials.discord}>
            Discord Server
          </a>
        </div>
      )}
      <div className="mt-1 text-sm text-light-grey-500">
        You can cancel orders at any time in the "Orders" tab.
      </div>
      <ButtonGroup
        className="mt-4"
        leftLabel="Cancel"
        rightLabel={
          !auth.isAuthenticated ? (
            "Sign In"
          ) : order.allowance.txStatus.isLoading ? (
            <ApprovingLabel />
          ) : needsApprove ? (
            "Approve"
          ) : (
            "Place Order"
          )
        }
        disabled={order.allowance.txStatus.isLoading}
        onClickLeft={props.onCancel}
        onClickRight={
          !auth.isAuthenticated
            ? auth.signIn
            : needsApprove
            ? order.allowance.approveRequiredForNextOrder
            : props.onSubmit
        }
      />
    </div>
  );
};

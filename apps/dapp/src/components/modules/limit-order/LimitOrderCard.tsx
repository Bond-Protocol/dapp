import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { BondButton } from "components/organisms/BondButton";
import { useState } from "react";
import defillama from "services/defillama";
import {
  InputCard,
  Input,
  Select,
  ActionInfoList,
  formatDate,
  Button,
  dateMath,
  formatCurrency,
} from "ui";
import { useAccount } from "wagmi";
import { useLimitOrderForMarket } from "./limit-order-context";
import { LimitOrderConfirmationDialog } from "./LimitOrderConfirmationDialog";

export const LimitOrderCard = (props: { market: CalculatedMarket }) => {
  const options = [
    { label: "1 day", id: 1 },
    { label: "3 days", id: 3 },
    { label: "7 days", id: 7 },
  ].filter(
    (
      o // remove dates that after market end date
    ) =>
      !dateMath.isBefore(
        new Date(props.market.conclusion! * 1000),
        dateMath.addDays(new Date(), o.id)
      )
  );

  const account = useAccount();
  const [isConfirming, setIsConfirming] = useState(false);

  const { allowance, ...order } = useLimitOrderForMarket();

  return (
    <div className="p-4">
      <div className="flex justify-between gap-x-2">
        <Input
          placeholder="Enter the order price"
          label="Limit Price"
          value={order.price}
          onChange={order.setPrice}
        />
        <div className="w-full">
          <div className="mb-1 text-sm font-light text-light-grey-400">
            Order Expiry
          </div>
          <Select
            options={options}
            //TODO: afx -> needs improving, have a better way to handle expiry
            defaultValue={(options[0]?.id ?? 1).toString()}
            onChange={(_e: any, value: string | null) =>
              order.setExpiry(Number(value))
            }
          />
        </div>
      </div>
      <InputCard
        className="mt-4"
        tokenIcon={props.market.quoteToken.logoURI}
        market={props.market}
        value={order.amount?.toString()}
        onChange={order.setAmount}
      />
      <ActionInfoList
        //@ts-ignore
        fields={generateSummaryFields(
          props.market,
          Number(order.payout),
          order.discount + "",
          order.expiry
        )}
      />
      <TransactionWizard
        titles={{ standby: "Limit Order Confirmation" }}
        open={isConfirming}
        chainId={props.market.chainId}
        onSubmit={() => order.createOrder()}
        onClose={() => setIsConfirming(false)}
        InitialDialog={(args: any) => (
          <LimitOrderConfirmationDialog {...args} market={props.market} />
        )}
      />
      <BondButton
        showConnect={!account.isConnected}
        showPurchaseLink={!allowance.hasSufficientBalance}
        chainId={props.market.chainId}
        quoteTokenSymbol={props.market.quoteToken.symbol}
        purchaseLink={defillama.getSwapURL(
          props.market.chainId,
          props.market.quoteToken.address
        )}
      >
        <Button
          className="mt-4 w-full"
          //disabled={!allowance.hasSufficientBalance}
          onClick={() => setIsConfirming(true)}
        >
          {!allowance.hasSufficientAllowance && allowance.hasSufficientBalance
            ? "APPROVE"
            : "PLACE ORDER"}
        </Button>
      </BondButton>
    </div>
  );
};

function generateSummaryFields(
  market: CalculatedMarket,
  payout: number,
  discount: string | number,
  expiry: number
) {
  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    market.chainId,
    "address"
  );

  return [
    {
      leftLabel: "Discount to Current",
      rightLabel: (
        <span
          className={
            Math.sign(Number(discount)) > 0
              ? "text-light-success"
              : "text-light-alert"
          }
        >
          {Number(discount).toFixed(2)}%
        </span>
      ),
    },
    {
      leftLabel: "You will get",
      rightLabel: `${
        !isFinite(payout)
          ? "?"
          : payout < 999
          ? formatCurrency.trimToken(payout)
          : formatCurrency.longFormatter.format(payout)
      } ${market.payoutToken.symbol}`,
    },
    {
      leftLabel: "Order expires on",
      rightLabel: formatDate.short(dateMath.addDays(new Date(), expiry)),
    },
    {
      leftLabel: "Limit Order Contract",
      rightLabel: `View on ${blockExplorerName}`,
      link: blockExplorerUrl + market.teller,
    },
  ];
}

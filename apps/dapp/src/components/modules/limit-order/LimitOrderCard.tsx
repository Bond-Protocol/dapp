import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { QueryWizard } from "components/common/QueryWizard";
import { BondButton } from "components/organisms/BondButton";
import { useState } from "react";
import defillama from "services/defillama";
import {
  InputCard,
  Input,
  ActionInfoList,
  formatDate,
  Button,
  dateMath,
  formatCurrency,
  SelectModal,
  SelectDateDialog,
} from "ui";
import { useAccount } from "wagmi";
import { useLimitOrderForMarket } from "./limit-order-context";
import { LimitOrderConfirmationDialog } from "./LimitOrderConfirmationDialog";

const selectExpiryOptions = [
  { label: "1 day", id: 1 },
  { label: "3 days", id: 3 },
  { label: "7 days", id: 7 },
  { label: "14 days", id: 14 },
  { label: "30 days", id: 30 },
];

export const LimitOrderCard = (props: { market: CalculatedMarket }) => {
  const account = useAccount();
  const { allowance, ...order } = useLimitOrderForMarket();

  const [isConfirming, setIsConfirming] = useState(false);

  // remove dates that go past market conclusion
  const options = selectExpiryOptions.filter(
    (o) =>
      !dateMath.isBefore(
        new Date(props.market.conclusion! * 1000),
        dateMath.addDays(new Date(), o.id)
      )
  );

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
          <SelectModal
            label="Order Expiry"
            options={options}
            defaultValue={options[0].id}
            ModalContent={(args) => (
              <SelectDateDialog
                {...args}
                limitDate={new Date(props?.market?.conclusion! * 1000)}
              />
            )}
            title="Select Order Expiry Date"
            onSubmit={({ value }) => {
              //TODO: afx -> clean up, SelectDateDialog is inconsistent with other dialogs
              order.setExpiry(value?.value ?? value);
            }}
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
          order.expiry,
          order.price
        )}
      />
      {isConfirming && (
        <QueryWizard
          open={isConfirming}
          onSubmit={() => order.createOrder()}
          onClose={() => setIsConfirming(false)}
          title="Confirm Order"
          StartDialog={(args: any) => (
            <LimitOrderConfirmationDialog {...args} market={props.market} />
          )}
          SuccessDialog={() => <div>Order placed successfully!</div>}
        />
      )}
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
          disabled={!order.price || !order.amount || !order.expiry}
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
  expiry: Date,
  price: string
) {
  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    market.chainId,
    "address"
  );

  const isValidPrice = !!Number(price) && isFinite(Number(price));
  const isDiscountPositive = Math.sign(Number(discount)) > 0;
  return [
    {
      leftLabel: "Discount to Current",
      rightLabel: (
        <span
          className={
            isValidPrice
              ? isDiscountPositive
                ? "text-light-success"
                : "text-light-alert"
              : ""
          }
        >
          {isValidPrice
            ? Number(discount).toFixed(2).concat("%")
            : "Set price to view discount"}
        </span>
      ),
    },
    {
      leftLabel: "You will get",
      rightLabel: `${
        isFinite(payout) && payout != 0
          ? payout < 999
            ? formatCurrency.trimToken(payout) + ` ${market.payoutToken.symbol}`
            : formatCurrency.longFormatter.format(payout) +
              ` ${market.payoutToken.symbol}`
          : `Set amount and price to view payout`
      }`,
    },
    {
      leftLabel: "Order expires on",
      rightLabel: formatDate.short(expiry),
    },
    {
      leftLabel: "Max fee",
      rightLabel: 1 + " " + market.quoteToken.symbol,
    },
    {
      leftLabel: "Limit Order Contract",
      rightLabel: `View on ${blockExplorerName}`,
      link: blockExplorerUrl + market.teller,
    },
  ];
}

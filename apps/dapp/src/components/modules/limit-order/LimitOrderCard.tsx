import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { BondButton } from "components/organisms/BondButton";
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
import { LimitOrderConfirmationDialog } from "./LimitOrderConfirmationDialog";
import { useLimitOrder } from "./use-limit-order";

const options = [
  { label: "1 day", id: 1 },
  { label: "3 days", id: 3 },
  { label: "7 days", id: 7 },
];

export const LimitOrderCard = (props: { market: CalculatedMarket }) => {
  const account = useAccount();
  const { allowance, ...order } = useLimitOrder(props.market);

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
            //@ts-ignore
            defaultValue={options[0].id}
            onChange={(_e, value) => order.setExpiry(Number(value))}
          />
        </div>
      </div>
      <InputCard
        tokenIcon={props.market.quoteToken.logoURI}
        className="mt-4"
        market={props.market}
        value={order.amount}
        //@ts-ignore
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
        open={true}
        chainId={props.market.chainId}
        //@ts-ignore
        onSubmit={() => {
          console.log("submit");
        }}
        onClose={() => {}}
        InitialDialog={(args) => (
          <LimitOrderConfirmationDialog
            quoteLogo={props.market.quoteToken.logoURI}
            payoutLogo={props.market.payoutToken.logoURI}
            payout={"1000"}
            amountIn={`0.01 ${props.market.quoteToken.symbol}/${props.market.payoutToken.symbol}`}
            vestingTime={"7 D"}
            expiry={new Date()}
            market={props.market}
          />
        )}
      />
      {/* <BondButton */}
      {/*   showConnect={!account.isConnected} */}{" "}
      {/*   showPurchaseLink={!allowance.hasSufficientBalance} */}
      {/*   chainId={props.market.chainId} */}
      {/*   quoteTokenSymbol={props.market.quoteToken.symbol} */}
      {/*   purchaseLink={defillama.getSwapURL( */}
      {/*     props.market.chainId, */}
      {/*     props.market.quoteToken.address */}
      {/*   )} */}
      {/* > */}
      {/*   <Button */}
      {/*     className="mt-4 w-full" */}
      {/*     disabled={!allowance.hasSufficientBalance} */}
      {/*   > */}
      {/*     {!allowance.hasSufficientAllowance && allowance.hasSufficientBalance */}
      {/*       ? "APPROVE" */}
      {/*       : "PLACE ORDER"} */}
      {/*   </Button> */}
      {/* </BondButton> */}
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

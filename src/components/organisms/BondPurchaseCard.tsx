import { useState } from "react";
import { Token } from "@bond-labs/contract-library";
import { Link } from "../atoms/Link";
import { InputCard } from "../molecules/InputCard";
import { SummaryCard } from "../molecules/SummaryCard";
import { Button } from "../atoms/Button";

export type DisplayToken = Partial<Token> & { logo?: string };
export type BondPurchaseCardProps = {
  quoteToken: DisplayToken;
  payoutToken: DisplayToken;
  userBalance: string;
  amountLeft?: string;
};

//NEED:
//calculated payout amount
//available left in bond
//network fee?
//bond contract?

export const BondPurchaseCard = (props: BondPurchaseCardProps) => {
  const [amount, setAmount] = useState("");
  const [_payout, setPayout] = useState(0);

  //TODO: update?
  const networkFee = (_payout * 0.03).toPrecision();
  const payout = +amount / 3;

  const summaryFields = [
    { label: "You will get", value: `${payout} ${props.payoutToken.symbol}` },
    {
      label: "Available in Bond",
      value: `${props.amountLeft || 0} ${props.payoutToken.symbol}`,
      tooltip: "Soon™",
    },
    {
      label: "Network Fee",
      value: `${networkFee} ${props.quoteToken.symbol}`,
      tooltip: "Soon™",
    },
    {
      label: "Bond Contract",
      value: (
        <Link href="https://etherscan.io" className="w-fit">
          View on Etherscan
        </Link>
      ),
      tooltip: "Soon™",
    },
  ];

  return (
    <>
      <InputCard
        isConnected={true}
        quoteToken={props.quoteToken}
        balance={props.userBalance}
        className="mt-4"
        onChange={(value) => setAmount(value || "")}
      />
      <SummaryCard fields={summaryFields} />
      <Button className="w-full mt-4">BOND</Button>
    </>
  );
};

export default BondPurchaseCard;

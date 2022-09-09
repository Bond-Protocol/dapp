import { Token } from "@bond-labs/contract-library";
import { Link } from "../atoms/Link";
import { InputCard } from "../molecules/InputCard";
import { SummaryCard } from "../molecules/SummaryCard";

export type DisplayToken = Partial<Token> & { logo?: string };
export type BondPurchaseCardProps = {
  quoteToken: DisplayToken;
  payoutToken: DisplayToken;
  amount?: string;
  userBalance: string;
  remainingCapacity?: string | number;
  onChange?: (amount: string) => void;
  payout?: string;
  networkFee?: string | number;
};

//NEED:
//calculated payout amount
//available left in bond
//network fee?
//bond contract?

export const BondPurchaseCard = (props: BondPurchaseCardProps) => {
  return (
    <InputCard
      isConnected={true}
      value={props.amount}
      quoteToken={props.quoteToken}
      balance={props.userBalance}
      className="mt-4"
      onChange={props.onChange}
    />
  );
};

export default BondPurchaseCard;

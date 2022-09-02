import {Token} from "@bond-labs/contract-library";
import {Link} from "../atoms/Link";
import {InputCard} from "../molecules/InputCard";
import {SummaryCard} from "../molecules/SummaryCard";

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
  const summaryFields = [
    {
      label: "You will get",
      value: `${props.payout} ${props.payoutToken.symbol}`,
    },
    {
      label: "Available in Bond",
      value: `${props.remainingCapacity || 0} ${props.payoutToken.symbol}`,
      tooltip: "Soon™",
    },
    {
      label: "Network Fee",
      value: `${props?.networkFee} ${props.quoteToken.symbol}`,
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
        value={props.amount}
        quoteToken={props.quoteToken}
        balance={props.userBalance}
        className="mt-4"
        onChange={props.onChange}
      />
      <SummaryCard fields={summaryFields} />
    </>
  );
};

export default BondPurchaseCard;

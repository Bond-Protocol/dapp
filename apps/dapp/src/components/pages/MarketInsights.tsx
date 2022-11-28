import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { InfoLabel, TableHeading } from "ui";
import receiptIcon from "../../assets/icons/receipt-icon.svg";
import { useMarkets } from "context/market-context";
import { calculateTrimDigits, trim } from "@bond-protocol/contract-library";
import { PageHeader } from "components/atoms/PageHeader";
import { getTokenDetails } from "ui";

export const MarketInsights = () => {
  const { allMarkets } = useMarkets();
  const { id, network } = useParams();
  const navigate = useNavigate();
  const markets = Array.from(allMarkets.values());
  const market = markets.find(
    ({ marketId, network: marketNetwork }) =>
      marketId === Number(id) && marketNetwork === network
  );

  if (!market) return <div>Unsupported Market</div>;
  const quoteToken = getTokenDetails(market.quoteToken);
  const payoutToken = getTokenDetails(market.payoutToken);

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : market.formattedShortVesting;

  return (
    <div>
      <PageHeader
        title={market?.quoteToken.symbol + "-" + market.payoutToken.symbol}
        icon={quoteToken.logoUrl}
        pairIcon={payoutToken.logoUrl}
        even={true}
      />

      <BondCard
        market={market}
        onClickTopRight={() => navigate("/")}
        topRightLabel="Go to Markets"
      />
      <div className="my-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Max Payout"
          tooltip="The maximum payout currently available from this market."
        >
          {trim(market.maxPayout, calculateTrimDigits(market.maxPayout))}{" "}
          {market.payoutToken.symbol}
        </InfoLabel>

        <InfoLabel
          label="Current Discount"
          tooltip="The current discount available from this market."
        >
          <p
            className={
              market?.discount > 0 ? "text-light-success" : "text-red-300"
            }
          >
            {trim(market.discount, calculateTrimDigits(market.discount))}%
          </p>
        </InfoLabel>

        <InfoLabel
          label={
            market.vestingType === "fixed-term"
              ? "Vesting Term"
              : "Vesting Date"
          }
          tooltip={
            market.vestingType === "fixed-term"
              ? "Purchase from a fixed term market will vest on the specified number of days after purchase. All bonds vest at midnight UTC."
              : "Purchases from a fixed expiry market will vest on the specified date. All bonds vest at midnight UTC. If the date is in the past, they will vest immediately upon purchase."
          }
        >
          {vestingLabel}
        </InfoLabel>
      </div>
      <div className="border-y">
        <div className="flex">
          <img src={receiptIcon} />
          <p className="font-faketion ml-2 py-4 uppercase"> Transactions</p>
        </div>
        <table className="mt-6 w-full table-fixed">
          <thead>
            <tr className="child:px-6">
              <TableHeading>TIME</TableHeading>
              <TableHeading alignEnd>TOTAL VALUE</TableHeading>
              <TableHeading alignEnd>BOND AMOUNT</TableHeading>
              <TableHeading alignEnd>PAYOUT AMOUNT</TableHeading>
              <TableHeading>ADDRESS</TableHeading>
              <TableHeading>TX ID</TableHeading>
            </tr>
          </thead>
          <tbody>{/*tx.map(() => { })*/}</tbody>
        </table>
      </div>
    </div>
  );
};

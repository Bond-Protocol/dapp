import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalculatedMarket } from "@bond-labs/contract-library";
import { BondListCard } from "..";
import { usePurchaseBond } from "hooks/usePurchaseBond";
import { formatLongNumber, getBlockExplorer, trimAddress } from "../../utils";
import { InfoLabel, Link, TableCell, TableHeading } from "components/atoms";
import receiptIcon from "../../assets/icons/receipt-icon.svg";

export type MarketInsightsPageProps = {
  markets: CalculatedMarket[];
};

export const MarketInsights = (props: MarketInsightsPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const market = props.markets.find(({ marketId }) => marketId === Number(id));
  const { getPayoutFor } = usePurchaseBond();
  const [maxPayout, setMaxPayout] = useState("0");

  const { blockExplorerUrl: blockExplorerAddressUrl } = getBlockExplorer(
    market?.network || "",
    "address"
  );
  const { blockExplorerUrl: blockExplorerTxUrl } = getBlockExplorer(
    market?.network || "",
    "tx"
  );

  useEffect(() => {
    const loadPayoutFor = async () => {
      if (!market) return;

      const payout = await getPayoutFor(
        market.maxAmountAccepted.toString(),
        market.quoteToken.decimals,
        market.marketId,
        market.auctioneer
      );
      setMaxPayout(Math.trunc(formatLongNumber(payout, market.quoteToken.decimals)).toString());
    };

    loadPayoutFor().catch((e) => {
      console.log(e, "Failed to load payout");
    });
  }, [getPayoutFor, market]);

  if (!market) return <div>Unsupported Market</div>;

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : market.formattedShortVesting;

  const sampcell = (
    <tr className="child:px-6 child:border-none">
      <TableCell>05/19/2022 00:16</TableCell>
      <TableCell className="text-right">$4,192,130.80</TableCell>
      <TableCell className="text-right">
        4200000 {market.quoteToken.symbol}
      </TableCell>
      <TableCell className="text-right">
        330 {market.payoutToken.symbol}
      </TableCell>
      <TableCell>
        <Link href={blockExplorerAddressUrl + market.auctioneer}>
          {trimAddress(market.auctioneer)}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={blockExplorerTxUrl + market.auctioneer}>
          {trimAddress(market.auctioneer)}
        </Link>
      </TableCell>
    </tr>
  );

  return (
    <div>
      <BondListCard
        market={market}
        onClickTopRight={() => navigate("/markets")}
        topRightLabel="Go to Markets"
      />
      <div className="my-16 flex justify-between gap-4 child:w-full">
        <InfoLabel label="Max Payout" tooltip="tooltip">
          {maxPayout} {market.payoutToken.symbol}
        </InfoLabel>
        <InfoLabel label="Current Discount" tooltip="Tooltip">
          <p
            className={
              market?.discount > 0 ? "text-light-success" : "text-red-300"
            }
          >
            {Math.trunc(market.discount)}%
          </p>
        </InfoLabel>
        <InfoLabel label="Network Fee" tooltip="tooltip">
          {`1 ${market.quoteToken.symbol}`}
        </InfoLabel>
        <InfoLabel label="Vesting Term" tooltip="tooltip">
          {vestingLabel}
        </InfoLabel>
      </div>
      <div className="border-y">
        <div className="flex">
          <img src={receiptIcon} />
          <p className="uppercase font-faketion ml-2 py-4"> Transactions</p>
        </div>
        <table className="w-full table-fixed mt-6">
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
          <tbody>
            {/*tx.map(() => { })*/}
            {sampcell}
          </tbody>
        </table>
      </div>
    </div>
  );
};

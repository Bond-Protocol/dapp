import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondPriceChart } from "components/organisms/BondPriceChart";
import { BondPurchaseCard } from "components/organisms";
import { formatDate, SummaryLabel } from "ui";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
  isFutureMarket?: boolean;
};

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  return (
    <div className={`flex gap-4 ${props.className}`}>
      {!props.isFutureMarket && (
        <div className="flex w-1/2">
          <BondPriceChart market={market} />
        </div>
      )}
      <div
        className={`flex flex-col justify-center ${
          props.isFutureMarket ? "w-full" : "w-1/2"
        }`}
      >
        <div className="mb-2 flex gap-x-1">
          {props.isFutureMarket && market.start && (
            <SummaryLabel
              small
              subtext="MARKET START DATE"
              className="w-full text-center"
              tooltip={`This market will open on ${formatDate.long(
                new Date(market.start * 1000)
              )}`}
              value={formatDate.short(new Date(market.start * 1000))}
            />
          )}
          {market.conclusion && (
            <SummaryLabel
              small
              className="w-full text-center"
              subtext="MARKET END DATE"
              tooltip={`Market will close and no longer be available on ${formatDate.long(
                new Date(market.conclusion * 1000)
              )}`}
              value={formatDate.short(new Date(market.conclusion * 1000))}
            />
          )}
        </div>
        {!props.isFutureMarket && <BondPurchaseCard market={market} />}
      </div>
    </div>
  );
};

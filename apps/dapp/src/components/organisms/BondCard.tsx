import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondPriceChart } from "components/organisms/BondPriceChart";
import { formatDate, SummaryLabel } from "ui";
import { BondPurchaseController } from "./BondPurchaseController";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
  isFutureMarket?: boolean;
};

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  return (
    <div
      className={`flex flex-col gap-4 px-2 md:flex-row md:px-0 ${props.className}`}
    >
      {!props.isFutureMarket && (
        <div className="flex w-full md:w-1/2">
          <BondPriceChart market={market} />
        </div>
      )}
      <div
        className={`flex min-h-[420px] flex-col ${
          props.isFutureMarket ? "w-full" : "md:w-1/2"
        }`}
      >
        <div className="mb-2 flex flex-col gap-x-1 md:flex-row">
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
        </div>
        {!props.isFutureMarket && <BondPurchaseController market={market} />}
      </div>
    </div>
  );
};

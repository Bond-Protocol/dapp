import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondPriceChart } from "components/organisms/BondPriceChart";
import { BondPurchaseCard } from "components/organisms";
import { InfoLabel, formatDate, SummaryLabel } from "ui";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
};

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  return (
    <div className={`flex gap-4 ${props.className}`}>
      <div className="flex w-1/2">
        <BondPriceChart market={market} />
      </div>
      <div className="flex w-1/2 flex-col">
        <div className="mb-2 flex gap-x-1">
          {market?.start && (
            <SummaryLabel
              small
              subtext="MARKET START DATE"
              value={formatDate.short(new Date())}
            />
          )}
          <SummaryLabel
            small
            className="w-full text-center"
            subtext="MARKET END DATE"
            value={formatDate.short(new Date())}
          />
        </div>
        <BondPurchaseCard market={market} />
      </div>
    </div>
  );
};

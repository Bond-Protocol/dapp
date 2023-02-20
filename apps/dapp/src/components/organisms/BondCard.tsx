import { FC } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { BondDiscountChart } from "components/organisms/BondDiscountChart";
import { BondPurchaseCard } from "components/organisms";

export type BondCardProps = {
  market: CalculatedMarket;
  className?: string;
};

export const BondCard: FC<BondCardProps> = ({ market, ...props }) => {
  return (
    <div className={`flex gap-4 ${props.className}`}>
      <div className="flex w-1/2">
        <BondDiscountChart market={market} />
      </div>
      <div className="w-1/2">
        <BondPurchaseCard market={market} />
      </div>
    </div>
  );
};

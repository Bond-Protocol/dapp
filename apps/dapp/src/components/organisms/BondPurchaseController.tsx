import { CalculatedMarket } from "@bond-protocol/contract-library";
import { LimitOrderCard } from "components/modules/limit-order/LimitOrderCard";
import { LimitOrderList } from "components/modules/limit-order/LimitOrderList";
import { Tabs } from "ui";
import { BondPurchaseCard } from "./BondPurchaseCard";

export const BondPurchaseController = ({
  market,
}: {
  market: CalculatedMarket;
}) => {
  const tabs = [{ label: "Bond" }, { label: "Limit" }, { label: "Orders" }];
  return (
    <Tabs tabs={tabs}>
      <div className="bg-white/5">
        <BondPurchaseCard market={market} />{" "}
      </div>
      <div className="bg-white/5">
        <LimitOrderCard market={market} />{" "}
      </div>
      <div className="bg-white/5">
        <LimitOrderList market={market} />{" "}
      </div>
    </Tabs>
  );
};

import { CalculatedMarket } from "@bond-protocol/contract-library";
import { LimitOrderProvider } from "components/modules/limit-order/limit-order-context";
import { LimitOrderCard } from "components/modules/limit-order/LimitOrderCard";
import { LimitOrderList } from "components/modules/limit-order/LimitOrderList";
import { RequiresAuth } from "components/utility/RequiresAuth";
import { Tabs } from "ui";
import { BondPurchaseCard } from "./BondPurchaseCard";

export const BondPurchaseController = ({
  market,
}: {
  market: CalculatedMarket;
}) => {
  const tabs = [{ label: "Bond" }, { label: "Limit" }, { label: "Orders" }];
  return (
    <LimitOrderProvider market={market}>
      <Tabs className="h-full" tabs={tabs}>
        <div className="bg-white/5">
          <BondPurchaseCard market={market} />{" "}
        </div>
        <div className="h-full bg-white/5">
          <RequiresAuth title="Sign in to place orders">
            <LimitOrderCard market={market} />{" "}
          </RequiresAuth>
        </div>
        <div className="h-full bg-white/5">
          <RequiresAuth
            title="Sign in to see your orders"
            subtitle="We're protecting you against impersonating"
          >
            <LimitOrderList />
          </RequiresAuth>
        </div>
      </Tabs>
    </LimitOrderProvider>
  );
};

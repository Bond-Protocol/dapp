import { CalculatedMarket } from "@bond-protocol/contract-library";
import { LimitOrderProvider } from "components/modules/limit-order/limit-order-context";
import { LimitOrderCard } from "components/modules/limit-order/LimitOrderCard";
import { LimitOrderList } from "components/modules/limit-order/LimitOrderList";
import { RequiresLimitOrderSupport } from "components/modules/limit-order/RequiresLimitOrderSupport";
import { RequiresAuth } from "components/utility/RequiresAuth";
import { useState } from "react";
import { Tabs } from "ui";
import { BondPurchaseCard } from "./BondPurchaseCard";

export const BondPurchaseController = ({
  market,
}: {
  market: CalculatedMarket;
}) => {
  const tabs = [{ label: "Bond" }, { label: "Limit" }, { label: "Orders" }];
  const [selected, setSelected] = useState(0);
  const isSupported = true;

  return (
    <LimitOrderProvider market={market}>
      <Tabs
        value={selected}
        onClick={setSelected}
        className="h-full"
        tabs={tabs}
      >
        <div className="h-full  bg-white/5">
          <BondPurchaseCard market={market} />{" "}
        </div>
        <div className="h-full bg-white/5">
          <RequiresLimitOrderSupport
            onClick={() => setSelected(0)}
            isSupported={isSupported}
          >
            <LimitOrderCard market={market} />
          </RequiresLimitOrderSupport>
        </div>
        <div className="h-full bg-white/5">
          <RequiresLimitOrderSupport
            onClick={() => setSelected(0)}
            isSupported={isSupported}
          >
            <RequiresAuth
              title="Sign in to see your orders"
              subtitle="We're protecting you against impersonating"
            >
              {/*TODO: Implement*/}
              <LimitOrderList
                market={market}
                onClickPlaceOrder={() => setSelected(1)}
                onCancelAll={() => {}}
              />
            </RequiresAuth>
          </RequiresLimitOrderSupport>
        </div>
      </Tabs>
    </LimitOrderProvider>
  );
};

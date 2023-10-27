import { useState } from "react";

import type { CalculatedMarket } from "@bond-protocol/contract-library";
import { Tabs } from "ui";

import {
  LimitOrderProvider,
  LimitOrderCard,
  LimitOrderListForMarket,
  RequiresAuth,
  RequiresLimitOrderSupport,
  useOrderService,
} from "components/modules/limit-order";

import { BondPurchaseCard } from "./BondPurchaseCard";

export const BondPurchaseController = ({
  market,
}: {
  market: CalculatedMarket;
}) => {
  const tabs = [{ label: "Bond" }, { label: "Limit" }, { label: "Orders" }];
  const [selected, setSelected] = useState(0);

  const { isTokenSupported } = useOrderService();
  const isSupported = isTokenSupported(market.quoteToken);

  return (
    <LimitOrderProvider market={market}>
      <Tabs
        value={selected}
        onClick={setSelected}
        className="h-full"
        tabs={tabs}
      >
        <div className="h-full bg-white/5">
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
              <LimitOrderListForMarket
                market={market}
                onClickPlaceOrder={() => setSelected(1)}
              />
            </RequiresAuth>
          </RequiresLimitOrderSupport>
        </div>
      </Tabs>
    </LimitOrderProvider>
  );
};

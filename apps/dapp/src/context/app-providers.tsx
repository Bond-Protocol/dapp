import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { SubgraphProvider } from "./subgraph-context";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";
import { TokenlistProvider } from "./tokenlist-context";
import { DashboardProvider } from "context/dashboard-context";
import { OrderServiceProvider } from "components/modules/limit-order";
import { ConditionaProvider } from "components/utility/ConditionalProvider";
import { featureToggles } from "src/feature-toggles";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  const LIMIT_ORDERS_ENABLED = featureToggles.LIMIT_ORDERS;

  return (
    <ReactQueryProvider>
      <BlockchainProvider>
        <SubgraphProvider>
          <TokenProvider>
            <MarketProvider>
              <ConditionaProvider
                Element={OrderServiceProvider}
                enabled={LIMIT_ORDERS_ENABLED}
              >
                <DashboardProvider>
                  <TokenlistProvider>
                    <Router>{children}</Router>
                  </TokenlistProvider>
                </DashboardProvider>
              </ConditionaProvider>
            </MarketProvider>
          </TokenProvider>
        </SubgraphProvider>
      </BlockchainProvider>
    </ReactQueryProvider>
  );
};

export const DevProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <BlockchainProvider>
        <Router>{children}</Router>
      </BlockchainProvider>
    </ReactQueryProvider>
  );
};

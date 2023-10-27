import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { SubgraphProvider } from "./subgraph-context";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";
import { TokenlistProvider } from "./tokenlist-context";
import { DashboardProvider } from "context/dashboard-context";
import {
  AuthProvider,
  OrderServiceProvider,
} from "components/modules/limit-order";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>
        <AuthProvider>
          <SubgraphProvider>
            <TokenProvider>
              <MarketProvider>
                <OrderServiceProvider>
                  <DashboardProvider>
                    <TokenlistProvider>
                      <Router>{children}</Router>
                    </TokenlistProvider>
                  </DashboardProvider>
                </OrderServiceProvider>
              </MarketProvider>
            </TokenProvider>
          </SubgraphProvider>
        </AuthProvider>
      </EvmProvider>
    </ReactQueryProvider>
  );
};

export const DevProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>
        <Router>{children}</Router>
      </EvmProvider>
    </ReactQueryProvider>
  );
};

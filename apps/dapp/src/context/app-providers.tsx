import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
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
      <BlockchainProvider>
        <AuthProvider>
          <SubgraphProvider>
            <TokenProvider>
              <MarketProvider>
                <DashboardProvider>
                  <TokenlistProvider>
                    <Router>{children}</Router>
                  </TokenlistProvider>
                </DashboardProvider>
              </MarketProvider>
            </TokenProvider>
          </SubgraphProvider>
        </AuthProvider>
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

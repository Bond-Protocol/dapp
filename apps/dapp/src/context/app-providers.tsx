import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";
import { TokenlistProvider } from "./tokenlist-context";
import { DashboardProvider } from "context/dashboard-context";
import { OrderServiceProvider } from "components/modules/limit-order";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <BlockchainProvider>
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

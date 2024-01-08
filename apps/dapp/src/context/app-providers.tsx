import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { MarketProvider } from "./market-context";
import { DashboardProvider } from "context/dashboard-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <BlockchainProvider>
        <MarketProvider>
          <DashboardProvider>
            <Router>{children}</Router>
          </DashboardProvider>
        </MarketProvider>
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

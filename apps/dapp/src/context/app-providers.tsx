import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { DashboardProvider } from "context/dashboard-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <BlockchainProvider>
        <DashboardProvider>
          <Router>{children}</Router>
        </DashboardProvider>
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

import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";

import { BlockchainProvider } from "./blockchain-provider";
import { ReactQueryProvider } from "./react-query-provider";
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
          <OrderServiceProvider>
            <DashboardProvider>
              <Router>{children}</Router>
            </DashboardProvider>
          </OrderServiceProvider>
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

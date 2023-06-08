import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { SubgraphProvider } from "context/subgraph-context";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";
import { TokenlistProvider } from "./tokenlist-context";
import { DashboardProvider } from "context/dashboard-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>
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

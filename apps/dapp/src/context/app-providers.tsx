import type { FC, ReactNode } from "react";
import { HashRouter as Router } from "react-router-dom";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";
import { TokenlistProvider } from "./tokenlist-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>
        <TokenProvider>
          <MarketProvider>
            <TokenlistProvider>
              <Router>{children}</Router>
            </TokenlistProvider>
          </MarketProvider>
        </TokenProvider>
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

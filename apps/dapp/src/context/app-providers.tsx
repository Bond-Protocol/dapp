import type { FC, ReactNode } from "react";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { HashRouter as Router } from "react-router-dom";
import { MarketProvider } from "./market-context";
import { TokenProvider } from "./token-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>
        <TokenProvider>
          <MarketProvider>
            <Router>{children}</Router>
          </MarketProvider>
        </TokenProvider>
      </EvmProvider>
    </ReactQueryProvider>
  );
};

export const DevProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <Router>{children}</Router>;
};

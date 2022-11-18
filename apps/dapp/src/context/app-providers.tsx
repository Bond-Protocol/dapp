import type { FC, ReactNode } from "react";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";
import { HashRouter as Router } from "react-router-dom";
import { MarketProvider } from "./market-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <EvmProvider>
          <MarketProvider>
            <Router>{children}</Router>
          </MarketProvider>
        </EvmProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

import type { FC, ReactNode } from "react";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "@material-tailwind/react";
import { HashRouter as Router } from "react-router-dom";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <EvmProvider>
          <Router>{children}</Router>
        </EvmProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

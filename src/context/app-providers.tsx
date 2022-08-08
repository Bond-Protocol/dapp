import type { FC, ReactNode } from "react";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <EvmProvider>{children}</EvmProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

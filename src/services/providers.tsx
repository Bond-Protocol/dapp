import type { FC, ReactNode } from "react";
import { EvmProvider } from "./evm-provider";
import { ReactQueryProvider } from "services/react-query-provider";
import { ThemeProvider } from "@material-tailwind/react";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <EvmProvider>{children}</EvmProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

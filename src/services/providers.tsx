import type {FC, ReactNode} from "react";
import {EvmProvider} from "./evm-provider";
import {ReactQueryProvider} from "services/react-query-provider";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <EvmProvider>{children}</EvmProvider>
    </ReactQueryProvider>
  );
};

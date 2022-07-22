import type {FC, ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  }
});

export const ReactQueryProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

import type { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

export const ReactQueryProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

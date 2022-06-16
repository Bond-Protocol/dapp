import type { FC, ReactNode } from 'react';
import { EvmProvider } from './evm-provider';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return <EvmProvider>{children}</EvmProvider>;
};

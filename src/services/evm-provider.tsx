import type { FC, ReactNode } from "react";
import { createClient, WagmiConfig } from "wagmi";

const client = createClient();

//TODO: (aphex) wagmi is causing bundle size to go up dramatically fsr
export const EvmProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

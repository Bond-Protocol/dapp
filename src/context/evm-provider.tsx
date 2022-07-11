import type { FC, ReactNode } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.rinkeby, chain.goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
});

//TODO: (aphex) wagmi is causing bundle size to go up dramatically fsr
export const EvmProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

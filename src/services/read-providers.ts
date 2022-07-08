import { Provider } from "@wagmi/core";
import { ethers } from "ethers";

export type ProviderOptions = {
  name: string;
  rpcs: string[];
  chainId: string;
};

const providerConfiguration: { [key: string]: ProviderOptions } = {
  goerli: {
    name: "goerli",
    chainId: "5",
    rpcs: [
      "https://eth-goerli.g.alchemy.com/v2/URVZjeFesCI2ToPIGKIPUHBS9XHl8PPj",
    ],
  },
};

export const providers: { [key: string]: Provider[] } = Object.values(
  providerConfiguration
).reduce((acc, config: ProviderOptions) => {
  return {
    ...acc,
    [config.name]: config.rpcs.map(
      (url) => new ethers.providers.StaticJsonRpcProvider(url, config.name)
    ),
  };
}, {});

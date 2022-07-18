import { Provider } from "@wagmi/core";
import { ethers } from "ethers";

type FallbackProviderConfig = {
  //RPC URL
  url: string;
  //Nodes with lower-value priorities are favoured
  priority: number;
  //Nodes with higher weight are favoured in quorum
  weight: number;
};

export type ProviderOptions = {
  name: string;
  rpcs: Array<FallbackProviderConfig>;
  chainId: string;
};

const providerConfiguration: ProviderOptions[] = [
  {
    name: "goerli",
    chainId: "5",
    rpcs: [
      {
        url: `https://eth-goerli.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_GOERLI_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
  {
    name: "rinkeby",
    chainId: "4",
    rpcs: [
      {
        url: `https://eth-rinkeby.alchemyapi.io/v2/${
          import.meta.env.VITE_ALCHEMY_RINKEBY_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
];

export const providers: { [key: string]: Provider } =
  //Go through every chain
  providerConfiguration.reduce((acc, config: ProviderOptions) => {
    //Setup static providers for nodes we own/trust
    const ownedNodesConfig = config.rpcs.map(({ url, priority, weight }) => {
      return {
        priority,
        weight,
        provider: new ethers.providers.StaticJsonRpcProvider(url, config.name),
      };
    });

    //Add the default ethers provider with the lowest priority as backup
    const defaultProvider = {
      priority: 9,
      provider: ethers.getDefaultProvider(config.name),
    };

    //Bring everything under one managed Provider instance
    //https://docs.ethers.io/v5/api/providers/other/#FallbackProvider
    const provider = new ethers.providers.FallbackProvider([
      ...ownedNodesConfig,
      defaultProvider,
    ]);

    return {
      ...acc,
      [config.name]: provider,
    };
  }, {});

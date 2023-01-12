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
    name: "mainnet",
    chainId: "1",
    rpcs: [
      {
        url: `https://eth-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_MAINNET_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
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
    name: "arbitrum",
    chainId: "42161",
    rpcs: [
      {
        url: `https://arb-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_ARBITRUM_MAINNET_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
  {
    name: "arbitrum-goerli",
    chainId: "421613",
    rpcs: [
      {
        url: `https://arb-goerli.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_ARBITRUM_GOERLI_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
  {
    name: "optimism-goerli",
    chainId: "420",
    rpcs: [
      {
        url: `https://opt-goerli.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_OPTIMISM_GOERLI_KEY
        }`,
        weight: 1,
        priority: 1,
      },
    ],
  },
  {
    name: "maticmum",
    chainId: "80001",
    rpcs: [
      {
        url: `https:/polygon-mumbai.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_POLYGON_MUMBAI_KEY
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
    /*
  NOTE: I've commented this out for now because it seems to be constantly making background requests,
  can always add the etherscan api above if needed.

    //Add the default ethers provider with the lowest priority as backup
    const defaultProvider = {
      priority: 9,
      provider: ethers.getDefaultProvider(config.name),
    };
*/
    //Bring everything under one managed Provider instance
    //https://docs.ethers.io/v5/api/providers/other/#FallbackProvider
    const provider = new ethers.providers.FallbackProvider([
      ...ownedNodesConfig,
      //     defaultProvider,
    ]);

    return {
      ...acc,
      [config.chainId]: provider,
    };
  }, {});

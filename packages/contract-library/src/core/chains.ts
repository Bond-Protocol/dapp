export enum CHAIN_ID {
  ETHEREUM_MAINNET = '1',
  GOERLI_TESTNET = '5',
  POA_CORE = '99',
  POA_SOKOL = '77',
  GNOSIS_MAINNET = '100',
  POLYGON_MAINNET = '137',
  POLYGON_MUMBAI_TESTNET = '80001',
  FANTOM_MAINNET = '250',
  BSC_MAINNET = '56',
  AVALANCHE_MAINNET = '43114',
  AVALANCHE_FUJI_TESTNET = '43113',
  CELO_MAINNET = '42220',
  CELO_ALFAJORES_TESTNET = '44787',
  FUSE_MAINNET = '122',
  MOONRIVER_MAINNET = '1285',
  ARBITRUM_MAINNET = '42161',
  ARBITRUM_GOERLI_TESTNET = '421613',
  OPTIMISM_MAINNET = '10',
  OPTIMISM_GOERLI_TESTNET = '420',
  AURORA_MAINNET = '1313161554',
  AURORA_TESTNET = '1313161555',
  BOBA_MAINNET = '288',
  HARMONY_MAINNET = '1666600000',
}

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

export interface Chain {
  displayName: string;
  chainName: string;
  chainId: string;
  isTestnet: boolean;
  nativeCurrency: NativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  blockExplorerName: string;
  image: string;
  imageAltText: string;
}

const ethereumMainnet: Chain = {
  displayName: 'Ethereum',
  chainName: 'mainnet',
  chainId: '1',
  isTestnet: false,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [''],
  blockExplorerUrls: ['https://etherscan.io/#/'], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: 'Etherscan',
  image:
    'https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ETHEREUM.png',
  imageAltText: 'Ethereum Logo',
};

const goerliTestnet: Chain = {
  displayName: "Goerli Testnet",
  chainName: "goerli",
  chainId: "5",
  isTestnet: true,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [""],
  blockExplorerUrls: ["https://goerli.etherscan.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Etherscan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ETHEREUM.png",
  imageAltText: "Ethereum Logo",
};

const polygonMainnet: Chain = {
  displayName: "Polygon",
  chainName: "matic",
  chainId: "137",
  isTestnet: false,
  nativeCurrency: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Polygonscan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/POLYGON.png",
  imageAltText: "Polygon Logo",
};

const polygonMumbaiTestnet: Chain = {
  displayName: "Polygon Mumbai Testnet",
  chainName: "mumbai",
  chainId: "80001",
  isTestnet: true,
  nativeCurrency: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Polygonscan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/POLYGON.png",
  imageAltText: "Polygon Logo",
};

const fantomMainnet: Chain = {
  displayName: "Fantom",
  chainName: "fantom",
  chainId: "250",
  isTestnet: false,
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ftm.tools"],
  blockExplorerUrls: ["https://ftmscan.com/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "FTMScan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/FANTOM.png",
  imageAltText: "Fantom Logo",
};

const avalancheMainnet: Chain = {
  displayName: "Avalanche",
  chainName: "avalanche",
  chainId: "43114",
  isTestnet: false,
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Snowtrace",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/AVALANCHE.png",
  imageAltText: "Avalanche Logo",
};

const avalancheFujiTestnet: Chain = {
  displayName: "Avalanche Fuji Testnet",
  chainName: "fuji",
  chainId: "43113",
  isTestnet: true,
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Snowtrace",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/AVALANCHE.png",
  imageAltText: "Avalanche Logo",
};

const bscMainnet: Chain = {
  displayName: "Binance Smart Chain",
  chainName: "bsc",
  chainId: "56",
  isTestnet: false,
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/bsc"],
  blockExplorerUrls: ["https://bscscan.com/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "BscScan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/BSC.png",
  imageAltText: "Binance Smart Chain Logo",
};

const arbitrumMainnet: Chain = {
  displayName: "Arbitrum",
  chainName: "arbitrum",
  chainId: "42161",
  isTestnet: false,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  blockExplorerUrls: ["https://arbiscan.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Arbiscan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  imageAltText: "Arbitrum Logo",
};

const arbitrumGoerliTestnet: Chain = {
  displayName: "Arbitrum Goerli",
  chainName: "arbitrum-goerli",
  chainId: "421613",
  isTestnet: true,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "AGOR",
    decimals: 18,
  },
  rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
  blockExplorerUrls: ["https://goerli.arbiscan.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Arbiscan",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  imageAltText: "Arbitrum Logo",
};

const optimismMainnet: Chain = {
  displayName: "Optimism",
  chainName: "optimism",
  chainId: "10",
  isTestnet: false,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.optimism.io"],
  blockExplorerUrls: ["https://optimistic.etherscan.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Optimism Explorer",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/OPTIMISM.png",
  imageAltText: "Optimism Logo",
};

const optimismGoerliTestnet: Chain = {
  displayName: "Optimism Goerli",
  chainName: "optimism-goerli",
  chainId: "420",
  isTestnet: true,
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://goerli.optimism.io"],
  blockExplorerUrls: ["https://goerli-optimism.etherscan.io/#/"], // DO NOT EDIT use contract-library/src/core/getBlockExplorer.ts
  blockExplorerName: "Optimism Goerli Explorer",
  image:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/OPTIMISM.png",
  imageAltText: "Optimism Logo",
};

export const CHAINS = new Map<string, Chain>([
  [CHAIN_ID.ETHEREUM_MAINNET, ethereumMainnet],
  [CHAIN_ID.GOERLI_TESTNET, goerliTestnet],
  [CHAIN_ID.POLYGON_MAINNET, polygonMainnet],
  [CHAIN_ID.POLYGON_MUMBAI_TESTNET, polygonMumbaiTestnet],
  [CHAIN_ID.FANTOM_MAINNET, fantomMainnet],
  [CHAIN_ID.BSC_MAINNET, bscMainnet],
  [CHAIN_ID.AVALANCHE_MAINNET, avalancheMainnet],
  [CHAIN_ID.AVALANCHE_FUJI_TESTNET, avalancheFujiTestnet],
  [CHAIN_ID.ARBITRUM_MAINNET, arbitrumMainnet],
  [CHAIN_ID.ARBITRUM_GOERLI_TESTNET, arbitrumGoerliTestnet],
  [CHAIN_ID.OPTIMISM_MAINNET, optimismMainnet],
  [CHAIN_ID.OPTIMISM_GOERLI_TESTNET, optimismGoerliTestnet],
]);

export const SUPPORTED_CHAINS: Chain[] = [
  CHAINS.get(CHAIN_ID.ETHEREUM_MAINNET) as Chain,
  CHAINS.get(CHAIN_ID.GOERLI_TESTNET) as Chain,
  CHAINS.get(CHAIN_ID.ARBITRUM_MAINNET) as Chain,
  CHAINS.get(CHAIN_ID.ARBITRUM_GOERLI_TESTNET) as Chain,
  CHAINS.get(CHAIN_ID.OPTIMISM_GOERLI_TESTNET) as Chain,
  CHAINS.get(CHAIN_ID.POLYGON_MUMBAI_TESTNET) as Chain,
  CHAINS.get(CHAIN_ID.AVALANCHE_FUJI_TESTNET) as Chain,
];

/*
  [
    CHAIN_ID.ANDROMEDA_MAINNET,
    {
      displayName: "Andromeda",
      chainId: "1088",
      isTestnet: false,
      nativeCurrency: {
        name: "Metis",
        symbol: "METIS",
        decimals: 18,
      },
      rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
      blockExplorerUrls: ["https://andromeda-explorer.metis.io/#/"],
      blockExplorerName: "Metis",
      image: "",
      imageAltText: "Andromeda Logo",
    },
  ],
  [
    CHAIN_ID.FANTOM_TESTNET,
    {
      displayName: "Fantom Testnet",
      chainId: "0xfa2",
      isTestnet: true,
      nativeCurrency: {
        name: "Fantom",
        symbol: "FTM",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.testnet.fantom.network"],
      blockExplorerUrls: ["https://testnet.ftmscan.com/#/"],
      blockExplorerName: "FTMScan",
      image: "",
      imageAltText: "Fantom Logo",
    },
  ],
*/

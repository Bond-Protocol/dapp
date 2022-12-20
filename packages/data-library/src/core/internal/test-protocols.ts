import { CHAIN_ID, SUPPORTED_LP_TYPES } from "../../constants";
import { ProtocolDefinition } from "../../types";
const links = {
  governanceVote: "",
  twitter: "https://twitter.com/bond_protocol",
  github: "https://github.com/bond-protocol",
  medium: "https://medium.com/@Bond_Protocol",
  homepage: "https://bondprotocol.finance/",
};

export const protocols: ProtocolDefinition[] = [
  {
    name: "AphexProtocol",
    description: "We help aphex own his liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: "0x62A665d3f9fc9a968dC35a789122981d9109349a",
    },
    tokens: [
      {
        name: "ETH-DAI SLP",
        symbol: "ETH-DAI SLP",
        //@ts-ignore
        lpType: SUPPORTED_LP_TYPES.SUSHISWAP,
        addresses: {
          [CHAIN_ID.GOERLI_TESTNET]:
            "0x46cE18B119D0EB454CDBD37545bBCa791bF325B3",
        },
        token0Address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        token1Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        priceSources: [],
      },
    ],
  },
  {
    name: "BigfishjoeProtocol",
    description: "We help bigfishjoe own his liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: "0x72A0363bbd9dE17435A57d6a6F2f89102F1EBE8b",
    },
  },
  {
    name: "BondProtocol",
    description: "We help protocols own their liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: [
        "0x69442345d059895bd408e7bde8ab1428c009cc83",
        "0xda8b43d5DA504A3A418AeEDcE1Ece868536807fA",
      ],
      [CHAIN_ID.ARBITRUM_GOERLI_TESTNET]: [
        "0x69442345d059895bd408e7bde8ab1428c009cc83",
        "0xda8b43d5DA504A3A418AeEDcE1Ece868536807fA",
      ],
    },
    tokens: [
      {
        name: "Test Compound",
        symbol: "COMP",
        priceSources: [
          { source: "coingecko", apiId: "compound-governance-token" },
        ],
        purchaseLinks: {
          [CHAIN_ID.GOERLI_TESTNET]: "https://app.compound.finance/",
        },
        addresses: {
          [CHAIN_ID.GOERLI_TESTNET]:
            "0x3587b2F7E0E2D6166d6C14230e7Fe160252B0ba4",
        },
      },
      {
        name: "COMP-USDT SLP",
        symbol: "COMP-USDT SLP",
        //@ts-ignore
        lpType: SUPPORTED_LP_TYPES.SUSHISWAP,
        addresses: {
          [CHAIN_ID.GOERLI_TESTNET]:
            "0x77195bB23B8Dac9F05D16092C7290BB7d1F7F1d3",
        },
        token0Address:
          "0x3587b2F7E0E2D6166d6C14230e7Fe160252B0ba4".toLowerCase(),
        token1Address:
          "0x79C950C7446B234a6Ad53B908fBF342b01c4d446".toLowerCase(),
        priceSources: [],
      },
      {
        name: "Balancer 50 WETH 50 USDC",
        symbol: "50WETH-50USDC",
        //@ts-ignore
        lpType: SUPPORTED_LP_TYPES.BALANCER_WEIGHTED_POOL,
        addresses: {
          [CHAIN_ID.GOERLI_TESTNET]:
            "0x9F1F16B025F703eE985B58cEd48dAf93daD2f7EF",
        },
        poolAddress: "0x9F1F16B025F703eE985B58cEd48dAf93daD2f7EF",
        vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        constituentTokens: [
          { address: "0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1", decimals: 18 },
          { address: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb", decimals: 6 },
        ],
        priceSources: [],
      },
      {
        name: "Balancer 50 TEMPLE 50 FRAX",
        symbol: "50TEMPLE-50FRAX",
        //@ts-ignore
        lpType: SUPPORTED_LP_TYPES.BALANCER_WEIGHTED_POOL,
        addresses: {
          [CHAIN_ID.GOERLI_TESTNET]:
            "0x89EA4363Bd541d27d9811E4Df1209dAa73154472",
        },
        poolAddress: "0x89EA4363Bd541d27d9811E4Df1209dAa73154472",
        vaultAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        constituentTokens: [
          { address: "0x73651AD693531F9937528009cC204a4d9b696a68", decimals: 18 },
          { address: "0x5631d8eA427129e15bDa68F0F9227C149bD29Dcf", decimals: 18 },
        ],
        priceSources: [],
      },
    ],
  },
  {
    name: "DevoltaireProtocol",
    description: "We help devoltaire own his liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: [
        "0x24Ef8c193E02c0d952eC56C0097dF33b7947b7F6",
        "0x7700dd38aB343300bd9D45741D7c53ee711e4532",
      ],
    },
  },
  {
    name: "TexProtocol",
    description: "We help tex own his liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: "0xE5e93C4CBA55e98cCAa2618AC0772CD6fEEB43C5",
    },
  },
  {
    name: "YellaProtocol",
    description: "We help Yella own his liquidity",
    links,
    logoUrl: "/logo-24.svg",
    issuerAddresses: {
      [CHAIN_ID.GOERLI_TESTNET]: ["0xcB6E1613029d790C00f89296808f278d6dc25B2f"],
    },
  },
];

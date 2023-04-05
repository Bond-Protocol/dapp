//@ts-nocheck
import {
  getAddressesByProtocol,
  TOKENS,
  aphexTokens,
} from "@bond-protocol/bond-library";

export const dai = {
  id: "dai",
  symbol: "dai",
  name: "Dai",
  asset_platform_id: "ethereum",
  platforms: {
    ethereum: "0x6b175474e89094c44da98b954eedeac495271d0f",
    "polygon-pos": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "binance-smart-chain": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    "optimistic-ethereum": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    "metis-andromeda": "0x4651b38e7ec14bb3db731369bfe5b08f2466bd0a",
    "harmony-shard-0": "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    avalanche: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "arbitrum-one": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    sora: "0x0200060000000000000000000000000000000000000000000000000000000000",
    moonriver: "0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844",
    aurora: "0xe3520349f477a5f6eb06107066048508498a291b",
    cronos: "0xf2001b145b43032aaf5ee2884e456ccd805f677d",
    fantom: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    moonbeam: "0x765277eebeca2e31912c9946eae1021199b39c61",
    syscoin: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
    "milkomeda-cardano": "0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c",
    energi: "0x0ee5893f434017d8881750101ea2f7c49c0eb503",
    cosmos:
      "ibc/0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7",
    astar: "0x6de33698e9e9b787e09d3bd7771ef63557e148bb",
    kava: "0x765277eebeca2e31912c9946eae1021199b39c61",
    "arbitrum-nova": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    velas: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    "klay-token": "0x078db7827a5531359f6cb63f62cfa20183c4f10c",
    xdai: "0x44fa8e6f47987339850636f88629646662444217",
    hydra: "abc2cd00700e06922bcf30fe0ad648507113cc56",
    "near-protocol":
      "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
  },
  detail_platforms: {
    ethereum: {
      decimal_place: 18,
      contract_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    "polygon-pos": {
      decimal_place: 18,
      contract_address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    },
    "binance-smart-chain": {
      decimal_place: 18,
      contract_address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    },
    "optimistic-ethereum": {
      decimal_place: 18,
      contract_address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    "metis-andromeda": {
      decimal_place: 18,
      contract_address: "0x4651b38e7ec14bb3db731369bfe5b08f2466bd0a",
    },
    "harmony-shard-0": {
      decimal_place: 18,
      contract_address: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    },
    avalanche: {
      decimal_place: 18,
      contract_address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    },
    "arbitrum-one": {
      decimal_place: 18,
      contract_address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    sora: {
      decimal_place: 18,
      contract_address:
        "0x0200060000000000000000000000000000000000000000000000000000000000",
    },
    moonriver: {
      decimal_place: 18,
      contract_address: "0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844",
    },
    aurora: {
      decimal_place: 18,
      contract_address: "0xe3520349f477a5f6eb06107066048508498a291b",
    },
    cronos: {
      decimal_place: 18,
      contract_address: "0xf2001b145b43032aaf5ee2884e456ccd805f677d",
    },
    fantom: {
      decimal_place: 18,
      contract_address: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    },
    moonbeam: {
      decimal_place: 18,
      contract_address: "0x765277eebeca2e31912c9946eae1021199b39c61",
    },
    syscoin: {
      decimal_place: 18,
      contract_address: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
    },
    "milkomeda-cardano": {
      decimal_place: 18,
      contract_address: "0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c",
    },
    energi: {
      decimal_place: 18,
      contract_address: "0x0ee5893f434017d8881750101ea2f7c49c0eb503",
    },
    cosmos: {
      decimal_place: 0,
      contract_address:
        "ibc/0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7",
    },
    astar: {
      decimal_place: 18,
      contract_address: "0x6de33698e9e9b787e09d3bd7771ef63557e148bb",
    },
    kava: {
      decimal_place: 18,
      contract_address: "0x765277eebeca2e31912c9946eae1021199b39c61",
    },
    "arbitrum-nova": {
      decimal_place: 18,
      contract_address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    velas: {
      decimal_place: 18,
      contract_address: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    },
    "klay-token": {
      decimal_place: 18,
      contract_address: "0x078db7827a5531359f6cb63f62cfa20183c4f10c",
    },
    xdai: {
      decimal_place: 18,
      contract_address: "0x44fa8e6f47987339850636f88629646662444217",
    },
    hydra: {
      decimal_place: null,
      contract_address: "abc2cd00700e06922bcf30fe0ad648507113cc56",
    },
    "near-protocol": {
      decimal_place: 18,
      contract_address:
        "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    },
  },
  block_time_in_minutes: 0,
  hashing_algorithm: null,
  categories: [
    "USD Stablecoin",
    "Decentralized Finance (DeFi)",
    "Stablecoins",
    "BNB Chain Ecosystem",
    "Harmony Ecosystem",
    "Avalanche Ecosystem",
    "Polygon Ecosystem",
    "Moonbeam Ecosystem",
    "Fantom Ecosystem",
    "Near Protocol Ecosystem",
    "Arbitrum Ecosystem",
    "Moonriver Ecosystem",
    "Gnosis Chain Ecosystem",
    "Ethereum Ecosystem",
    "Cronos Ecosystem",
    "Arbitrum Nova Ecosystem",
    "Metis Ecosystem",
    "Velas Ecosystem",
    "Optimism Ecosystem",
  ],
  public_notice: null,
  additional_notices: [],
  description: {
    en: "MakerDAO has launched Multi-collateral DAI (MCD). This token refers to the new DAI that is collaterized by multiple assets.\r\n",
  },
  links: {
    homepage: ["https://makerdao.com/", "", ""],
    blockchain_site: [
      "https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f",
      "https://ethplorer.io/address/0x6b175474e89094c44da98b954eedeac495271d0f",
      "https://blockchair.com/ethereum/erc-20/token/0x6b175474e89094c44da98b954eedeac495271d0f",
      "https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      "https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      "https://bscscan.com/token/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      "https://snowtrace.io/token/0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
      "https://avascan.info/blockchain/c/address/0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
      "https://explorer.mainnet.aurora.dev/token/0xe3520349f477a5f6eb06107066048508498a291b/token-transfers",
      "https://moonriver.moonscan.io/token/0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844",
    ],
    official_forum_url: ["", "", ""],
    chat_url: ["", "", ""],
    announcement_url: ["", ""],
    twitter_screen_name: "MakerDAO",
    facebook_username: "",
    bitcointalk_thread_identifier: null,
    telegram_channel_identifier: "makerdaoOfficial",
    subreddit_url: "https://www.reddit.com/r/MakerDAO",
    repos_url: {
      github: [],
      bitbucket: [],
    },
  },
  image: {
    thumb:
      "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
    small:
      "https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734",
    large:
      "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
  },
  country_origin: "",
  genesis_date: null,
  contract_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  sentiment_votes_up_percentage: 75,
  sentiment_votes_down_percentage: 25,
  market_cap_rank: 18,
  coingecko_rank: 165,
  coingecko_score: 40.022,
  developer_score: 0,
  community_score: 41.386,
  liquidity_score: 69.787,
  public_interest_score: 0.018,
  developer_data: {
    forks: 0,
    stars: 0,
    subscribers: 0,
    total_issues: 0,
    closed_issues: 0,
    pull_requests_merged: 0,
    pull_request_contributors: 0,
    code_additions_deletions_4_weeks: {
      additions: null,
      deletions: null,
    },
    commit_count_4_weeks: 0,
    last_4_weeks_commit_activity_series: [],
  },
  public_interest_stats: {
    alexa_rank: 30241,
    bing_matches: null,
  },
  status_updates: [],
  last_updated: "2023-03-20T15:15:30.665Z",
};

export const ohm = {
  id: "olympus",
  symbol: "ohm",
  name: "Olympus",
  asset_platform_id: "ethereum",
  platforms: {
    ethereum: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  },
  detail_platforms: {
    ethereum: {
      decimal_place: 9,
      contract_address: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
    },
  },
  block_time_in_minutes: 0,
  hashing_algorithm: null,
  categories: [
    "Rebase Tokens",
    "Decentralized Finance (DeFi)",
    "Asset-backed Tokens",
    "Ethereum Ecosystem",
  ],
  public_notice:
    "This is Olympus (OHM) v2. If you have not migrated, read more at: https://docs.olympusdao.finance/main/basics/migration",
  additional_notices: [],
  description: {
    en: "",
  },
  links: {
    homepage: ["https://olympusdao.finance/", "", ""],
    blockchain_site: [
      "https://etherscan.io/token/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
      "https://ethplorer.io/address/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    official_forum_url: [
      "",
      "https://olympusdao.medium.com/",
      "https://www.youtube.com/c/olympusdao",
    ],
    chat_url: ["https://discord.gg/bzFn5nstFB", "", ""],
    announcement_url: ["", ""],
    twitter_screen_name: "OlympusDAO",
    facebook_username: "",
    bitcointalk_thread_identifier: null,
    telegram_channel_identifier: "OlympusTG",
    subreddit_url: "https://www.reddit.com/r/olympusdao/",
    repos_url: {
      github: ["https://github.com/OlympusDAO"],
      bitbucket: [],
    },
  },
  image: {
    thumb:
      "https://assets.coingecko.com/coins/images/14483/thumb/token_OHM_%281%29.png?1628311611",
    small:
      "https://assets.coingecko.com/coins/images/14483/small/token_OHM_%281%29.png?1628311611",
    large:
      "https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png?1628311611",
  },
  country_origin: "",
  genesis_date: null,
  contract_address: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  sentiment_votes_up_percentage: 81.82,
  sentiment_votes_down_percentage: 18.18,
  market_cap_rank: 151,
  coingecko_rank: 466,
  coingecko_score: 28.468,
  developer_score: 0,
  community_score: 37.464,
  liquidity_score: 28.318,
  public_interest_score: 0.011,
  developer_data: {
    forks: 0,
    stars: 0,
    subscribers: 0,
    total_issues: 0,
    closed_issues: 0,
    pull_requests_merged: 0,
    pull_request_contributors: 0,
    code_additions_deletions_4_weeks: {
      additions: null,
      deletions: null,
    },
    commit_count_4_weeks: 0,
    last_4_weeks_commit_activity_series: [],
  },
  public_interest_stats: {
    alexa_rank: null,
    bing_matches: null,
  },
  status_updates: [],
  last_updated: "2023-03-20T15:18:24.184Z",
};

const samplePrices = {
  "camelot-token": { usd: 2979.49 },
  "compound-governance-token": { usd: 42.28 },
  "convex-finance": { usd: 5.1 },
  dai: { usd: 1.0 },
  "dola-usd": { usd: 0.992941 },
  ethereum: { usd: 1760.35 },
  everipedia: { usd: 0.00657865 },
  frax: { usd: 0.998734 },
  "gmd-protocol": { usd: 62.9 },
  gmx: { usd: 68.87 },
  "governance-ohm": { usd: 2751.57 },
  govi: { usd: 0.478081 },
  "ibuffer-token": { usd: 0.291616 },
  "inverse-finance": { usd: 47.35 },
  "jpeg-d": { usd: 0.00080279 },
  layer2dao: { usd: 0.00220314 },
  "liquity-usd": { usd: 1.013 },
  "matic-network": { usd: 1.094 },
  "neutra-finance": { usd: 1.8 },
  "new-order": { usd: 0.0406143 },
  olympus: { usd: 10.27 },
  pendle: { usd: 0.316152 },
  pine: { usd: 0.192935 },
  redacted: { usd: 286.79 },
  "shapeshift-fox-token": { usd: 0.03340564 },
  sperax: { usd: 0.00590564 },
  "sperax-usd": { usd: 0.994354 },
  tether: { usd: 1.002 },
  "usd-coin": { usd: 1.001 },
  "wrapped-bitcoin": { usd: 27821 },
  y2k: { usd: 4.03 },
};
//Map coingecko result to our format
const toProtocolTokens = (token: any) => {
  return {
    name: token.name,
    symbol: token.symbol.toUpperCase(),
    icon: token.image.small,
    addresses: token.platforms,
    links: token.links,
  };
};

export const list = aphexTokens
  .filter((t) => t.priceSources.some((s) => s.source === "coingecko"))
  .map((token) => {
    const apiId = token.priceSources[0]?.apiId;
    const price = samplePrices[apiId]?.usd ?? 0;

    return {
      id: apiId,
      name: token.name,
      symbol: token.symbol,
      icon: token.logoUrl,
      addresses: token.addresses,
      apiId,
      price,
      priceSources: token.priceSources,
    };
  });

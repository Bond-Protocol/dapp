export interface TokenBase {
  chainId: number;
  address: string;
}

export interface Token extends TokenBase {
  name: string;
  symbol: string;
  decimals: number;
  tbv?: number;
  purchaseCount?: number;
  uniqueBonders?: {
    count: number;
  };
  payoutTokenTbvs?: any[];
  usedAsPayout?: boolean;
  price?: number;
  id?: string;
  purchaseLink?: string;
  logoUrl?: string;
  logoURI?: string;
  details?: {
    description?: string;
    links: {
      homepage?: string;
      discord?: string;
    };
  };
  markets?: any[];
}

export interface LpPair {
  id: string;
  token0: Token;
  token1: Token;
}

export interface LpToken extends Token {
  lpPair?: LpPair;
}

export interface BalancerWeightedPoolToken extends Token {
  poolAddress: string;
  vaultAddress: string;
  constituentTokens: TokenBase[];
}

export interface PrecalculatedMarket {
  id: string;
  chainId: string;
  name: string;
  auctioneer: string;
  teller: string;
  owner: string;
  vesting: number;
  vestingType: string;
  payoutToken: Token;
  quoteToken: LpToken | BalancerWeightedPoolToken;
  isInstantSwap: boolean;
  totalBondedAmount: number;
  totalPayoutAmount: number;
  creationBlockTimestamp: number;
  callbackAddress: string;
  bondsIssued: number;
}

export interface CalculatedMarket {
  id: string;
  chainId: string;
  auctioneer: string;
  teller: string;
  marketId: bigint;
  discount: number;
  discountedPrice: number;
  quoteTokensPerPayoutToken: number;
  fullPrice: number;
  maxAmountAccepted: string;
  maxPayout: string;
  maxPayoutUsd: number;
  ownerBalance: string;
  ownerAllowance: string;
  vesting: number;
  vestingType: string;
  currentCapacity: number;
  capacityToken: Token;
  isCapacityInQuote: boolean;
  owner: string;
  quoteToken: LpToken;
  payoutToken: Token;
  isLive: boolean;
  isInstantSwap: boolean;
  totalBondedAmount: number;
  totalPayoutAmount: number;
  tbvUsd: number;
  creationBlockTimestamp: number;
  creationDate: string;
  callbackAddress: string;
  bondsIssued: number;
  start?: number;
  conclusion?: number;
  formattedFullPrice: string;
  formattedMaxPayoutUsd: string;
  formattedDiscountedPrice: string;
  formattedShortVesting: string;
  formattedLongVesting: string;
  formattedTbvUsd: string;
}

export enum BOND_TYPE {
  FIXED_EXPIRY_DEPRECATED = "fixed-expiration",
  FIXED_EXPIRY_SDA = "fixed-expiry-sda",
  FIXED_EXPIRY_SDA_V1_1 = "fixed-expiry-sda-v1_1",
  FIXED_EXPIRY_FPA = "fixed-expiry-fpa",
  FIXED_EXPIRY_OFDA = "fixed-expiry-ofda",
  FIXED_EXPIRY_OSDA = "fixed-expiry-osda",
  FIXED_TERM_DEPRECATED = "fixed-term",
  FIXED_TERM_SDA = "fixed-term-sda",
  FIXED_TERM_SDA_V1_1 = "fixed-term-sda-v1_1",
  FIXED_TERM_FPA = "fixed-term-fpa",
  FIXED_TERM_OFDA = "fixed-term-ofda",
  FIXED_TERM_OSDA = "fixed-term-osda",
}

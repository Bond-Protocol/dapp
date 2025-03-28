type Address = `0x${string}`;

export interface TokenBase {
  chainId: number;
  address: Address;
}

export interface TokenlistToken extends TokenBase {
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface Token extends TokenlistToken {
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
  auctioneer: Address;
  teller: Address;
  owner: Address;
  vesting: number;
  vestingType: string;
  payoutToken: Token;
  quoteToken: LpToken | BalancerWeightedPoolToken;
  isInstantSwap: boolean;
  totalBondedAmount: number;
  totalPayoutAmount: number;
  creationBlockTimestamp: number;
  callbackAddress: Address;
  bondsIssued: number;
}

export interface CalculatedMarket extends PrecalculatedMarket {
  marketId: number;
  discount: number;
  discountedPrice: number;
  quoteTokensPerPayoutToken: number;
  fullPrice: number;
  maxAmountAccepted: string;
  maxPayout: string;
  maxPayoutUsd: number;
  ownerBalance: string;
  ownerAllowance: string;
  currentCapacity: number;
  capacityToken: Token;
  isCapacityInQuote: boolean;
  isLive: boolean;
  tbvUsd: number;
  creationDate: string;
  start?: number;
  conclusion?: number;
  formatted: {
    fullPrice: string;
    maxPayoutUsd: string;
    discountedPrice: string;
    shortVesting: string;
    longVesting: string;
    tbvUsd: string;
    quoteTokensPerPayoutToken: string;
  };
  blockExplorer: {
    name: string;
    url: string;
  };
}

export enum BondType {
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

export type CreateMarketParams = {
  payoutToken: Address;
  quoteToken: Address;
  callbackAddr: Address;
  capacityInQuote: boolean;
  capacity: any;
  debtBuffer: any;
  vesting: any;
  start: any;
  conclusion: any;
  duration?: any;
  depositInterval: any;
  scaleAdjustment: any;
  formattedPrice: any;
  formattedInitialPrice: any;
  formattedMinimumPrice: any;
  oracle?: Address;
  fixedDiscount?: any;
  maxDiscountFromCurrent?: any;
  baseDiscount?: any;
  targetIntervalDiscount?: any;
};

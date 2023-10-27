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
  marketId: number;
  discount: number;
  discountedPrice: number;
  formattedDiscountedPrice: string;
  quoteTokensPerPayoutToken: number;
  fullPrice: number;
  formattedFullPrice: string;
  maxAmountAccepted: string;
  maxPayout: string;
  maxPayoutUsd: number;
  ownerBalance: string;
  ownerAllowance: string;
  formattedMaxPayoutUsd: string;
  vesting: number;
  vestingType: string;
  formattedShortVesting: string;
  formattedLongVesting: string;
  currentCapacity: number;
  capacityToken: string;
  owner: string;
  quoteToken: LpToken;
  payoutToken: Token;
  isLive: boolean;
  isInstantSwap: boolean;
  totalBondedAmount: number;
  totalPayoutAmount: number;
  tbvUsd: number;
  formattedTbvUsd: string;
  creationBlockTimestamp: number;
  creationDate: string;
  callbackAddress: string;
  bondsIssued: number;
  start?: number;
  conclusion?: number;
}

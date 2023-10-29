import { Address } from 'viem';
import { BigNumberish } from 'ethers';

export type CreateMarketParams = {
  payoutToken: string;
  quoteToken: string;
  callbackAddr: string;
  capacityInQuote: boolean;
  capacity: BigNumberish;
  debtBuffer: BigNumberish;
  vesting: BigNumberish;
  start: BigNumberish;
  conclusion?: BigNumberish;
  duration?: BigNumberish;
  depositInterval: BigNumberish;
  scaleAdjustment?: BigNumberish;
  formattedPrice?: BigNumberish;
  formattedInitialPrice?: BigNumberish;
  formattedMinimumPrice?: BigNumberish;
  oracle?: string;
  fixedDiscount?: BigNumberish;
  maxDiscountFromCurrent?: BigNumberish;
  baseDiscount?: BigNumberish;
  targetIntervalDiscount?: BigNumberish;
};

export interface TokenBase {
  chainId: number;
  address: Address;
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
  price: number;
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
  blockExplorerName?: string;
  blockExplorerUrl?: string;
  formattedFullPrice: string;
  formattedMaxPayoutUsd: string;
  formattedDiscountedPrice: string;
  formattedShortVesting: string;
  formattedLongVesting: string;
  formattedTbvUsd: string;
}

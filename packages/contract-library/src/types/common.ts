import { PromiseOrValue } from './contracts/common';
import { BigNumberish } from 'ethers';
import { CHAIN_ID } from 'src/../../data-library/dist/src';

export type CreateMarketParams = {
  payoutToken: PromiseOrValue<string>;
  quoteToken: PromiseOrValue<string>;
  callbackAddr: PromiseOrValue<string>;
  capacityInQuote: PromiseOrValue<boolean>;
  capacity: PromiseOrValue<BigNumberish>;
  formattedInitialPrice: PromiseOrValue<BigNumberish>;
  formattedMinimumPrice: PromiseOrValue<BigNumberish>;
  debtBuffer: PromiseOrValue<BigNumberish>;
  vesting: PromiseOrValue<BigNumberish>;
  conclusion: PromiseOrValue<BigNumberish>;
  depositInterval: PromiseOrValue<BigNumberish>;
  scaleAdjustment: PromiseOrValue<BigNumberish>;
};

export interface TokenBase {
  address: string;
  decimals: number;
  price: number;
}

export interface Token extends TokenBase {
  id: string;
  name: string;
  symbol: string;
  purchaseLink?: string;
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
}

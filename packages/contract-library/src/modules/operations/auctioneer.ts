import { BigNumberish } from '@ethersproject/bignumber';
import { BigNumber, ContractTransaction, ethers, Signer } from 'ethers';
import { Overrides } from '@ethersproject/contracts';
import { CreateMarketParams } from 'src/types';
import { Provider } from '@ethersproject/providers';
import {
  BOND_TYPE,
  getAuctioneerForCreate,
  getAuctioneerFromAggregator,
} from 'modules/contract-helper';
import auctioneerAbi from 'src/abis/protocol/auctioneer.json';

export async function closeMarket(
  id: BigNumberish,
  chainId: string,
  signer: Signer,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  const auctioneer = await getAuctioneerFromAggregator(id, chainId, signer);

  try {
    return auctioneer.closeMarket(id, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createMarket(
  config: CreateMarketParams,
  bondType: BOND_TYPE,
  chainId: string,
  signer: Signer,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  const auctioneer = getAuctioneerForCreate(signer, bondType, chainId);

  try {
    const bytes = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(address payoutToken, address quoteToken, address callbackAddr, bool capacityInQuote, uint256 capacity, uint256 formattedInitialPrice, uint256 formattedMinimumPrice, uint32 debtBuffer, uint48 vesting, uint48 conclusion, uint32 depositInterval, int8 scaleAdjustment)',
      ],
      [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.capacityInQuote,
          config.capacity,
          config.formattedInitialPrice,
          config.formattedMinimumPrice,
          config.debtBuffer,
          config.vesting,
          config.conclusion,
          config.depositInterval,
          config.scaleAdjustment,
        ],
      ],
    );

    return auctioneer.createMarket(bytes, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export function createMarketMultisig(config: CreateMarketParams): string {
  try {
    // @ts-ignore
    const auctioneer = new ethers.utils.Interface(auctioneerAbi.abi);

    const bytes = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(address payoutToken, address quoteToken, address callbackAddr, bool capacityInQuote, uint256 capacity, uint256 formattedInitialPrice, uint256 formattedMinimumPrice, uint32 debtBuffer, uint48 vesting, uint48 conclusion, uint32 depositInterval, int8 scaleAdjustment)',
      ],
      [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.capacityInQuote,
          config.capacity,
          config.formattedInitialPrice,
          config.formattedMinimumPrice,
          config.debtBuffer,
          config.vesting,
          config.conclusion,
          config.depositInterval,
          config.scaleAdjustment,
        ],
      ],
    );

    return auctioneer.encodeFunctionData('createMarket', [bytes]);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getMarketInfoForPurchase(
  id: BigNumberish,
  chainId: string,
  provider: Provider,
): Promise<{
  owner: string;
  callbackAddr: string;
  payoutToken: string;
  quoteToken: string;
  vesting: number;
  maxPayout: BigNumber;
}> {
  const auctioneer = await getAuctioneerFromAggregator(id, chainId, provider);

  try {
    return auctioneer.getMarketInfoForPurchase(id);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

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
  signer: Signer,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  const auctioneer = await getAuctioneerFromAggregator(id, signer);

  try {
    return auctioneer.closeMarket(id, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function estimateGasCreateMarket(
  config: CreateMarketParams,
  bondType: BOND_TYPE,
  signer: Signer,
  overrides?: Overrides,
): Promise<BigNumber> {
  const auctioneer = await getAuctioneerForCreate(signer, bondType);
  try {
    const bytes = getBytes(config, bondType);
    // @ts-ignore
    return auctioneer.estimateGas.createMarket(bytes, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createMarket(
  config: CreateMarketParams,
  bondType: BOND_TYPE,
  signer: Signer,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  const auctioneer = await getAuctioneerForCreate(signer, bondType);
  try {
    const bytes = getBytes(config, bondType);
    // @ts-ignore
    return auctioneer.createMarket(bytes, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export function createMarketMultisig(
  config: CreateMarketParams,
  bondType: BOND_TYPE,
): string {
  try {
    // @ts-ignore
    const auctioneer = new ethers.utils.Interface(auctioneerAbi.abi);
    const bytes = getBytes(config, bondType);

    return auctioneer.encodeFunctionData('createMarket', [bytes]);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function getBytes(config: CreateMarketParams, bondType: BOND_TYPE) {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_DEPRECATED:
      return ethers.utils.defaultAbiCoder.encode(
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
    case BOND_TYPE.FIXED_EXPIRY_SDA_V1_1:
    case BOND_TYPE.FIXED_TERM_SDA_V1_1:
      return ethers.utils.defaultAbiCoder.encode(
        [
          'tuple(address payoutToken, address quoteToken, address callbackAddr, bool capacityInQuote, uint256 capacity, uint256 formattedInitialPrice, uint256 formattedMinimumPrice, uint32 debtBuffer, uint48 vesting, uint48 start, uint32 duration, uint32 depositInterval, int8 scaleAdjustment)',
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
            config.start,
            config.duration,
            config.depositInterval,
            config.scaleAdjustment,
          ],
        ],
      );
    case BOND_TYPE.FIXED_EXPIRY_FPA:
    case BOND_TYPE.FIXED_TERM_FPA:
      return ethers.utils.defaultAbiCoder.encode(
        [
          'tuple(address payoutToken, address quoteToken, address callbackAddr, bool capacityInQuote, uint256 capacity, uint256 formattedPrice, uint32 depositInterval, uint48 vesting, uint48 start, uint48 duration, int8 scaleAdjustment)',
        ],
        [
          [
            config.payoutToken,
            config.quoteToken,
            config.callbackAddr,
            config.capacityInQuote,
            config.capacity,
            config.formattedPrice,
            config.depositInterval,
            config.vesting,
            config.start,
            config.duration,
            config.scaleAdjustment,
          ],
        ],
      );
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
    case BOND_TYPE.FIXED_TERM_OFDA:
      return ethers.utils.defaultAbiCoder.encode(
        [
          'tuple(address payoutToken, address quoteToken, address callbackAddr, address oracle, uint48 fixedDiscount, uint48 maxDiscountFromCurrent, bool capacityInQuote, uint256 capacity, uint32 depositInterval, uint48 vesting, uint48 start, uint48 duration)',
        ],
        [
          [
            config.payoutToken,
            config.quoteToken,
            config.callbackAddr,
            config.oracle,
            config.fixedDiscount,
            config.maxDiscountFromCurrent,
            config.capacityInQuote,
            config.capacity,
            config.depositInterval,
            config.vesting,
            config.start,
            config.duration,
          ],
        ],
      );
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
    case BOND_TYPE.FIXED_TERM_OSDA:
      return ethers.utils.defaultAbiCoder.encode(
        [
          'tuple(address payoutToken, address quoteToken, address callbackAddr, address oracle, uint48 baseDiscount, uint48 maxDiscountFromCurrent, uint48 targetIntervalDiscount, bool capacityInQuote, uint256 capacity, uint32 depositInterval, uint48 vesting, uint48 start, uint48 duration)',
        ],
        [
          [
            config.payoutToken,
            config.quoteToken,
            config.callbackAddr,
            config.oracle,
            config.baseDiscount,
            config.maxDiscountFromCurrent,
            config.targetIntervalDiscount,
            config.capacityInQuote,
            config.capacity,
            config.depositInterval,
            config.vesting,
            config.start,
            config.duration,
          ],
        ],
      );
  }
}

export async function getMarketInfoForPurchase(
  id: BigNumberish,
  provider: Provider,
): Promise<{
  owner: string;
  callbackAddr: string;
  payoutToken: string;
  quoteToken: string;
  vesting: number;
  maxPayout: BigNumber;
}> {
  const auctioneer = await getAuctioneerFromAggregator(id, provider);

  try {
    return auctioneer.getMarketInfoForPurchase(id);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

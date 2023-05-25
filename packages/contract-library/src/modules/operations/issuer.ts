import { BigNumberish } from '@ethersproject/bignumber';
import { Overrides } from '@ethersproject/contracts';
import { BigNumber, Signer } from 'ethers';
import {getAggregator, getAuctioneerFromAggregator, getChainId} from '../contract-helper';
import { Provider } from '@ethersproject/providers';
import { IERC20__factory, PrecalculatedMarket } from 'src/types';
import { CHAIN_ID } from '@bond-protocol/bond-library';
import {
  getAddresses,
  getAuctioneer,
  getMarketInfoForPurchase,
  getTeller,
  isInstantSwap,
} from 'src/modules';

export async function setIntervals(
  id: BigNumberish,
  intervals: [BigNumberish, BigNumberish, BigNumberish],
  signer: Signer,
  chainId: string,
  overrides?: Overrides,
): Promise<unknown> {
  const auctioneer = await getAuctioneerFromAggregator(id, signer);

  try {
    return auctioneer.setIntervals(id, intervals, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function pushOwnership(
  id: BigNumberish,
  newOwnerAddress: string,
  signer: Signer,
  chainId: string,
  overrides?: Overrides,
): Promise<unknown> {
  const auctioneer = await getAuctioneerFromAggregator(id, signer);

  try {
    return auctioneer.pushOwnership(id, newOwnerAddress, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export function getMarketData(
  marketIds: BigNumberish[],
  prices: Map<string, number>,
  provider: Provider,
): Promise<PrecalculatedMarket>[] {
  const doMarket = async (
    marketId: BigNumberish,
  ): Promise<PrecalculatedMarket> => {
    const [chainId, auctioneer, teller, marketInfo, instantSwap] = await Promise.all([
      getChainId(provider),
      getAuctioneer(marketId, provider),
      getTeller(marketId, provider),
      getMarketInfoForPurchase(marketId, provider),
      isInstantSwap(marketId, provider),
    ]);

    const payoutToken = IERC20__factory.connect(
      marketInfo.payoutToken,
      provider,
    );
    const quoteToken = IERC20__factory.connect(marketInfo.quoteToken, provider);

    const [
      payoutName,
      payoutSymbol,
      payoutDecimals,
      quoteName,
      quoteSymbol,
      quoteDecimals,
    ] = await Promise.all([
      payoutToken.name(),
      payoutToken.symbol(),
      payoutToken.decimals(),
      quoteToken.name(),
      quoteToken.symbol(),
      quoteToken.decimals(),
    ]);

    const addresses = getAddresses(chainId);

    let vestingType = '';
    if (teller === addresses.fixedTermTeller) {
      vestingType = 'fixed-term';
    } else if (teller === addresses.fixedExpiryTeller) {
      vestingType = 'fixed-expiration';
    }

    return {
      id: marketId.toString(),
      chainId: chainId,
      name: 'PLACEHOLDER', // TODO: Use auctioneer name
      auctioneer: auctioneer,
      teller: teller,
      owner: marketInfo.owner,
      vesting: marketInfo.vesting,
      vestingType: vestingType,
      callbackAddress: marketInfo.callbackAddr,
      payoutToken: {
        id: chainId + '_' + marketInfo.payoutToken,
        chainId: chainId,
        address: marketInfo.payoutToken,
        name: payoutName,
        symbol: payoutSymbol,
        decimals: payoutDecimals,
        price: prices.get(marketInfo.payoutToken) || 0,
      },
      quoteToken: {
        id: chainId + '_' + marketInfo.quoteToken,
        chainId: chainId,
        address: marketInfo.quoteToken,
        name: quoteName,
        symbol: quoteSymbol,
        decimals: quoteDecimals,
        price: prices.get(marketInfo.quoteToken) || 0,
      },
      isInstantSwap: instantSwap,
      totalBondedAmount: 0,
      totalPayoutAmount: 0,
      creationBlockTimestamp: 0,
    };
  };

  const promises: Promise<PrecalculatedMarket>[] = [];
  marketIds.forEach((marketId) => promises.push(doMarket(marketId)));

  return promises;
}

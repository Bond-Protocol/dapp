import { WalletClient } from 'viem';
import {
  getFixedTermOfdaAuctioneer,
  getFixedExpirySdaAuctioneer,
  getFixedExpirySdAv1_1Auctioneer,
  getFixedExpiryFpaAuctioneer,
  getFixedExpiryOfdaAuctioneer,
  getFixedTermSdaAuctioneer,
  getFixedTermFpaAuctioneer,
  getFixedTermOsdaAuctioneer,
} from '../contracts';

export function getAuctioneerFactoryForName(
  auctioneerName: string,
  auctioneerAddress: string,
  client: WalletClient,
) {
  let factory;
  switch (auctioneerName) {
    case 'BondFixedExpCDA':
      factory = getFixedExpirySdaAuctioneer;
      break;
    case 'BondFixedExpSDAv1_1':
      factory = getFixedExpirySdAv1_1Auctioneer;
      break;
    case 'BondFixedExpFPA':
      factory = getFixedExpiryFpaAuctioneer;
      break;
    case 'BondFixedExpOFDA':
      factory = getFixedExpiryOfdaAuctioneer;
      break;
    case 'BondFixedExpOSDA':
      factory = getFixedExpiryOfdaAuctioneer;
      break;
    case 'BondFixedTermCDA':
      factory = getFixedTermSdaAuctioneer;
      break;
    case 'BondFixedTermSDAv1_1':
      factory = getFixedExpirySdAv1_1Auctioneer;
      break;
    case 'BondFixedTermFPA':
      factory = getFixedTermFpaAuctioneer;
      break;
    case 'BondFixedTermOFDA':
      factory = getFixedTermOfdaAuctioneer;
      break;
    case 'BondFixedTermOSDA':
      factory = getFixedTermOsdaAuctioneer;
      break;
    default:
      throw Error(
        'Auctioneer Factory Not Found for ' +
          auctioneerName +
          ' ' +
          auctioneerAddress,
      );
  }

  return factory({ address: auctioneerAddress, publicClient: client });
}

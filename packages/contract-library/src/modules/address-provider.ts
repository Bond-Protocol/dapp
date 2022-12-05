import { BOND_TYPE } from 'src/modules/contract-helper';

export type ContractAddresses = {
  authority: string;
  aggregator: string;
  fixedExpirationTeller: string;
  fixedExpirationAuctioneer: string;
  fixedTermTeller: string;
  fixedTermAuctioneer: string;
};

export type AddressesForType = {
  teller: string;
  auctioneer: string;
};

const mainnetAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpirationTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirationAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
};

const goerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpirationTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirationAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
};

const arbitrumMainnetAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpirationTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirationAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
};

const arbitrumGoerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpirationTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirationAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
};

const addressesByChain: { [key: string]: ContractAddresses } = {
  '1': mainnetAddresses,
  'mainnet': mainnetAddresses,
  'homestead': mainnetAddresses,
  '5': goerliAddresses,
  'goerli': goerliAddresses,
  '42161': arbitrumMainnetAddresses,
  'arbitrum': arbitrumMainnetAddresses,
  '421613': arbitrumGoerliAddresses,
  'arbitrum-goerli': arbitrumGoerliAddresses,
  'arbitrumGoerli': arbitrumGoerliAddresses,
};

export const getAddresses = (chainId: string): ContractAddresses => {
  return addressesByChain[chainId] || mainnetAddresses;
};

export const getAddressesForType = (
  chainId: string,
  bondType: BOND_TYPE,
): AddressesForType => {
  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY:
      return {
        teller: getAddresses(chainId).fixedExpirationTeller,
        auctioneer: getAddresses(chainId).fixedExpirationAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM:
      return {
        teller: getAddresses(chainId).fixedTermTeller,
        auctioneer: getAddresses(chainId).fixedTermAuctioneer,
      };
  }
};

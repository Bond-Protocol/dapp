import { BOND_TYPE } from 'src/modules/contract-helper';

export type ContractAddresses = {
  authority: string;
  aggregator: string;
  fixedExpiryTeller: string;
  fixedExpirySDAAuctioneer: string;
  fixedExpiryFPAAuctioneer: string;
  fixedExpiryOFDAAuctioneer: string;
  fixedExpiryOSDAAuctioneer: string;
  fixedTermTeller: string;
  fixedTermSDAAuctioneer: string;
  fixedTermFPAAuctioneer: string;
  fixedTermOFDAAuctioneer: string;
  fixedTermOSDAAuctioneer: string;
};

export type AddressesForType = {
  teller: string;
  auctioneer: string;
};

const mainnetAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpiryFPAAuctioneer: '',
  fixedExpiryOFDAAuctioneer: '',
  fixedExpiryOSDAAuctioneer: '',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermFPAAuctioneer: '',
  fixedTermOFDAAuctioneer: '',
  fixedTermOSDAAuctioneer: '',
};

const goerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpiryFPAAuctioneer: '0xdc54a1463D72f828042F1a6F10826D3Dc6FF358C',
  fixedExpiryOFDAAuctioneer: '0xaAdb8904C8E83C00848f9eC519ad4833227BE47B',
  fixedExpiryOSDAAuctioneer: '0x2E579f046c1474166cc3cc4c7Ab5fAD0B0E05e50',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermFPAAuctioneer: '0x5aF872Bb472D08370df72019717E336758F1fa87',
  fixedTermOFDAAuctioneer: '0x56A07e0b05D60EF41318c60935c57924804d4541',
  fixedTermOSDAAuctioneer: '0xF1d4fef484b50eB66Eb7c5cF4FAA04166573317C',
};

const arbitrumMainnetAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpiryFPAAuctioneer: '',
  fixedExpiryOFDAAuctioneer: '',
  fixedExpiryOSDAAuctioneer: '',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermFPAAuctioneer: '',
  fixedTermOFDAAuctioneer: '',
  fixedTermOSDAAuctioneer: '',
};

const arbitrumGoerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpiryFPAAuctioneer: '',
  fixedExpiryOFDAAuctioneer: '',
  fixedExpiryOSDAAuctioneer: '',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermFPAAuctioneer: '',
  fixedTermOFDAAuctioneer: '',
  fixedTermOSDAAuctioneer: '',
};

const addressesByChain: { [key: string]: ContractAddresses } = {
  '1': mainnetAddresses,
  'mainnet': mainnetAddresses,
  'homestead': mainnetAddresses,
  '5': goerliAddresses,
  'goerli': goerliAddresses,
  '42161': arbitrumMainnetAddresses,
  'arbitrum': arbitrumMainnetAddresses,
  'arbitrum-one': arbitrumMainnetAddresses,
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
    case BOND_TYPE.FIXED_EXPIRY_SDA:
      return {
        teller: getAddresses(chainId).fixedExpiryTeller,
        auctioneer: getAddresses(chainId).fixedExpirySDAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_FPA:
      return {
        teller: getAddresses(chainId).fixedExpiryTeller,
        auctioneer: getAddresses(chainId).fixedExpiryFPAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
      return {
        teller: getAddresses(chainId).fixedExpiryTeller,
        auctioneer: getAddresses(chainId).fixedExpiryOFDAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
      return {
        teller: getAddresses(chainId).fixedExpiryTeller,
        auctioneer: getAddresses(chainId).fixedExpiryOSDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_SDA:
      return {
        teller: getAddresses(chainId).fixedTermTeller,
        auctioneer: getAddresses(chainId).fixedTermSDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_FPA:
      return {
        teller: getAddresses(chainId).fixedTermTeller,
        auctioneer: getAddresses(chainId).fixedTermFPAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_OFDA:
      return {
        teller: getAddresses(chainId).fixedTermTeller,
        auctioneer: getAddresses(chainId).fixedTermOFDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_OSDA:
      return {
        teller: getAddresses(chainId).fixedTermTeller,
        auctioneer: getAddresses(chainId).fixedTermOSDAAuctioneer,
      };
  }
};

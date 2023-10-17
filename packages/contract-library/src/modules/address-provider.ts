import { Address } from 'viem';
import { BOND_TYPE } from 'src/modules/contract-helper';

export type ContractAddresses = {
  authority: Address;
  aggregator: Address;
  fixedExpiryTeller: Address;
  fixedExpirySDAAuctioneer: Address;
  fixedExpirySDAv1_1Auctioneer: Address;
  fixedExpiryFPAAuctioneer: Address;
  fixedExpiryOFDAAuctioneer: Address;
  fixedExpiryOSDAAuctioneer: Address;
  fixedTermTeller: Address;
  fixedTermSDAAuctioneer: Address;
  fixedTermSDAv1_1Auctioneer: Address;
  fixedTermFPAAuctioneer: Address;
  fixedTermOFDAAuctioneer: Address;
  fixedTermOSDAAuctioneer: Address;
  settlement: Address;
};

export type AddressesForType = {
  teller: Address;
  auctioneer: Address;
};

export type BaseMarketPricing = 'dynamic' | 'static';
export type OracleMarketPricing = 'oracle-dynamic' | 'oracle-static';
export type MarketPricing = BaseMarketPricing | OracleMarketPricing;

export const getMarketTypeByAuctioneer = (address: string): MarketPricing => {
  switch (address.toLowerCase()) {
    case arbitrumMainnetAddresses.fixedExpiryFPAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermFPAAuctioneer.toLowerCase():
      return 'static';

    case arbitrumMainnetAddresses.fixedExpiryOFDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermOFDAAuctioneer.toLowerCase():
      return 'oracle-static';

    case arbitrumMainnetAddresses.fixedExpiryOSDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermOSDAAuctioneer.toLowerCase():
      return 'oracle-dynamic';

    case arbitrumMainnetAddresses.fixedExpirySDAAuctioneer.toLowerCase():
    case arbitrumMainnetAddresses.fixedTermSDAAuctioneer.toLowerCase():
    default:
      return 'dynamic';
  }
};

const mainnetAddresses: Partial<ContractAddresses> = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpiryFPAAuctioneer: '0xFEF9A527ac84836DC9939Ad75eb8ce325bBE0E54',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermFPAAuctioneer: '0xF7F9Ae2415F8Cb89BEebf9662A19f2393e7065e0',
  settlement: '0x007105D27BCe31CcFFA76Fc191886e944606E34a',
};

const goerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpirySDAv1_1Auctioneer: '0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646',
  fixedExpiryFPAAuctioneer: '0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55',
  fixedExpiryOFDAAuctioneer: '0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6',
  fixedExpiryOSDAAuctioneer: '0xFE05DA9fffc72027C26E2327A9e6339670CD1b90',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermSDAv1_1Auctioneer: '0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F',
  fixedTermFPAAuctioneer: '0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1',
  fixedTermOFDAAuctioneer: '0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd',
  fixedTermOSDAAuctioneer: '0xF705DA9476a172408e1B94b2A7B2eF595A91C29b',
  settlement: '0x007105D27BCe31CcFFA76Fc191886e944606E34a',
};

const arbitrumMainnetAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpirySDAv1_1Auctioneer: '0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646',
  fixedExpiryFPAAuctioneer: '0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55',
  fixedExpiryOFDAAuctioneer: '0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6',
  fixedExpiryOSDAAuctioneer: '0xFE05DA9fffc72027C26E2327A9e6339670CD1b90',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermSDAv1_1Auctioneer: '0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F',
  fixedTermFPAAuctioneer: '0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1',
  fixedTermOFDAAuctioneer: '0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd',
  fixedTermOSDAAuctioneer: '0xF705DA9476a172408e1B94b2A7B2eF595A91C29b',
  settlement: '0x007105D27BCe31CcFFA76Fc191886e944606E34a',
};

const arbitrumGoerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpirySDAv1_1Auctioneer: '0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646',
  fixedExpiryFPAAuctioneer: '0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55',
  fixedExpiryOFDAAuctioneer: '0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6',
  fixedExpiryOSDAAuctioneer: '0xFE05DA9fffc72027C26E2327A9e6339670CD1b90',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermSDAv1_1Auctioneer: '0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F',
  fixedTermFPAAuctioneer: '0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1',
  fixedTermOFDAAuctioneer: '0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd',
  fixedTermOSDAAuctioneer: '0xF705DA9476a172408e1B94b2A7B2eF595A91C29b',
  settlement: '0x007105D27BCe31CcFFA76Fc191886e944606E34a',
};

const optimismMainnetAddresses: Partial<ContractAddresses> = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAv1_1Auctioneer: '0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646',
  fixedExpiryFPAAuctioneer: '0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55',
  fixedExpiryOFDAAuctioneer: '0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6',
  fixedExpiryOSDAAuctioneer: '0xFE05DA9fffc72027C26E2327A9e6339670CD1b90',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAv1_1Auctioneer: '0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F',
  fixedTermFPAAuctioneer: '0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1',
  fixedTermOFDAAuctioneer: '0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd',
  fixedTermOSDAAuctioneer: '0xF705DA9476a172408e1B94b2A7B2eF595A91C29b',
  settlement: '',
};

const optimismGoerliAddresses: ContractAddresses = {
  authority: '0x007A0F48A4e3d74Ab4234adf9eA9EB32f87b4b14',
  aggregator: '0x007A66A2a13415DB3613C1a4dd1C942A285902d1',
  fixedExpiryTeller: '0x007FE70dc9797C4198528aE43d8195ffF82Bdc95',
  fixedExpirySDAAuctioneer: '0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD',
  fixedExpirySDAv1_1Auctioneer: '0xFE5DA041e5a3941BA12EbaBA7A7492BEAf91B646',
  fixedExpiryFPAAuctioneer: '0xFEF9A53AA10Ce2C9Ab6519AEE7DF82767F504f55',
  fixedExpiryOFDAAuctioneer: '0xFE0FDA2ACB13249099E5edAc64439ac76C7eF4B6',
  fixedExpiryOSDAAuctioneer: '0xFE05DA9fffc72027C26E2327A9e6339670CD1b90',
  fixedTermTeller: '0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6',
  fixedTermSDAAuctioneer: '0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222',
  fixedTermSDAv1_1Auctioneer: '0xF75DA09c8538b7AFe8B9D3adC1d626dA5D33467F',
  fixedTermFPAAuctioneer: '0xF7F9A96cDBFEFd70BDa14a8f30EC503b16bCe9b1',
  fixedTermOFDAAuctioneer: '0xF70FDAae514a8b48B83caDa51C0847B46Bb698bd',
  fixedTermOSDAAuctioneer: '0xF705DA9476a172408e1B94b2A7B2eF595A91C29b',
  settlement: '',
};

const addressesByChain: {
  [key: string]: ContractAddresses;
} = {
  '1': mainnetAddresses as ContractAddresses,
  'mainnet': mainnetAddresses as ContractAddresses,
  'homestead': mainnetAddresses as ContractAddresses,
  '5': goerliAddresses,
  'goerli': goerliAddresses,
  '42161': arbitrumMainnetAddresses,
  'arbitrum': arbitrumMainnetAddresses,
  'arbitrum-one': arbitrumMainnetAddresses,
  '421613': arbitrumGoerliAddresses,
  'arbitrum-goerli': arbitrumGoerliAddresses,
  'arbitrumGoerli': arbitrumGoerliAddresses,
  '10': optimismMainnetAddresses as ContractAddresses,
  'optimism': optimismMainnetAddresses as ContractAddresses,
  '420': optimismGoerliAddresses,
  'optimism-goerli': optimismGoerliAddresses,
};

const addressesByChainId: Record<number, ContractAddresses> = {
  1: mainnetAddresses as ContractAddresses,
  5: goerliAddresses,
  42161: arbitrumMainnetAddresses,
  421613: arbitrumGoerliAddresses,
  10: optimismMainnetAddresses as ContractAddresses,
  420: optimismGoerliAddresses,
};

export const getAddressesV2 = (chainId: number) =>
  addressesByChainId[chainId] ?? mainnetAddresses;

export const getAddresses = (chainId: string): ContractAddresses => {
  return addressesByChain[chainId] || mainnetAddresses;
};

export const getAddressesForType = (
  chain_id: number | string | { id: string; label: string },
  bondType: BOND_TYPE,
): AddressesForType => {
  let id = typeof chain_id === 'object' ? chain_id.id : String(chain_id);

  switch (bondType) {
    case BOND_TYPE.FIXED_EXPIRY_SDA:
    case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
      return {
        teller: getAddresses(id).fixedExpiryTeller,
        auctioneer: getAddresses(id).fixedExpirySDAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_SDA_V1_1:
      return {
        teller: getAddresses(id).fixedExpiryTeller,
        auctioneer: getAddresses(id).fixedExpirySDAv1_1Auctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_FPA:
      return {
        teller: getAddresses(id).fixedExpiryTeller,
        auctioneer: getAddresses(id).fixedExpiryFPAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_OFDA:
      return {
        teller: getAddresses(id).fixedExpiryTeller,
        auctioneer: getAddresses(id).fixedExpiryOFDAAuctioneer,
      };
    case BOND_TYPE.FIXED_EXPIRY_OSDA:
      return {
        teller: getAddresses(id).fixedExpiryTeller,
        auctioneer: getAddresses(id).fixedExpiryOSDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_SDA:
    case BOND_TYPE.FIXED_TERM_DEPRECATED:
      return {
        teller: getAddresses(id).fixedTermTeller,
        auctioneer: getAddresses(id).fixedTermSDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_SDA_V1_1:
      return {
        teller: getAddresses(id).fixedTermTeller,
        auctioneer: getAddresses(id).fixedTermSDAv1_1Auctioneer,
      };
    case BOND_TYPE.FIXED_TERM_FPA:
      return {
        teller: getAddresses(id).fixedTermTeller,
        auctioneer: getAddresses(id).fixedTermFPAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_OFDA:
      return {
        teller: getAddresses(id).fixedTermTeller,
        auctioneer: getAddresses(id).fixedTermOFDAAuctioneer,
      };
    case BOND_TYPE.FIXED_TERM_OSDA:
      return {
        teller: getAddresses(id).fixedTermTeller,
        auctioneer: getAddresses(id).fixedTermOSDAAuctioneer,
      };
  }
};

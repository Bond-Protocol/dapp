import { BOND_TYPE } from 'modules/contract-helper';

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
  authority: '0x007A0F3B057945db86408197DAa7C04373B5a94A',
  aggregator: '0x007A66B9e719b3aBb2f3917Eb47D4231a17F5a0D',
  fixedExpirationTeller: '0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156',
  fixedExpirationAuctioneer: '0x007FEA2a31644F20b0fE18f69643890b6F878AA6',
  fixedTermTeller: '0x007F77B53ed0F058616335bc040cD326E125daE0',
  fixedTermAuctioneer: '0x007F7A6012A5e03f6F388dd9F19Fd1D754Cfc128',
};

const goerliAddresses: ContractAddresses = {
  authority: '0x007A0F3B057945db86408197DAa7C04373B5a94A',
  aggregator: '0x007A66B9e719b3aBb2f3917Eb47D4231a17F5a0D',
  fixedExpirationTeller: '0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156',
  fixedExpirationAuctioneer: '0x007FEA2a31644F20b0fE18f69643890b6F878AA6',
  fixedTermTeller: '0x007F77B53ed0F058616335bc040cD326E125daE0',
  fixedTermAuctioneer: '0x007F7A6012A5e03f6F388dd9F19Fd1D754Cfc128',
};

const addressesByChain: { [key: string]: ContractAddresses } = {
  '1': mainnetAddresses,
  'mainnet': mainnetAddresses,
  'homestead': mainnetAddresses,
  '5': goerliAddresses,
  'goerli': goerliAddresses,
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

import { CalculatedMarket } from 'types';

export const formatVestingTerm = (market: CalculatedMarket) => {
  return market.vestingType === 'fixed-term'
    ? market.formatted.longVesting
    : market.formatted.shortVesting;
};

export default {
  formatVestingTerm,
};

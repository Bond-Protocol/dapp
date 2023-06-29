import {
  longFormatter,
  usdFormatter,
  usdLongFormatter,
  Column,
  DiscountLabel,
  formatDate,
} from "src";
import {
  CalculatedMarket,
  calculateTrimDigits,
  CHAINS,
} from "@bond-protocol/contract-library";

export const bondColumn: Column<CalculatedMarket> = {
  label: "Bond",
  accessor: "bond",
  width: "w-[13%]",
  defaultSortOrder: "asc",
  formatter: (market) => {
    const chain = CHAINS.get(market.chainId);
    return {
      value: market.quoteToken.symbol,
      icon: market.quoteToken.logoURI,
      chainChip: chain?.image,
    };
  },
};

const bondPrice: Column<CalculatedMarket> = {
  label: "Bond Price",
  accessor: "bondPrice",
  width: "w-[18%]",
  formatter: (market) => {
    return {
      icon: market.payoutToken.logoURI,
      value: market.formattedDiscountedPrice,
      subtext: market.formattedFullPrice
        ? market.formattedFullPrice + " Market"
        : "Unknown",
    };
  },
};

export const discountColumn: Column<CalculatedMarket> = {
  label: "Discount",
  accessor: "discount",
  alignEnd: true,
  width: "w-[7%]",
  defaultSortOrder: "desc",
  Component: DiscountLabel,
  formatter: (market) => {
    const value =
      !isNaN(market.discount) &&
      market.discount !== Infinity &&
      market.discount !== -Infinity
        ? market.discount + "%"
        : "Unknown";

    return {
      value:
        !isNaN(market.discount) &&
        market.discount !== Infinity &&
        market.discount !== -Infinity
          ? market.discount + "%"
          : "Unknown",
      sortValue: value.includes("Unknown") ? 100 : market.discount + 100,
    };
  },
};

const maxPayout: Column<CalculatedMarket> = {
  label: "Max Payout",
  accessor: "maxPayout",
  alignEnd: true,
  width: "w-[14%]",
  formatter: (market) => {
    return {
      value:
        longFormatter.format(parseFloat(market.maxPayout)) +
        " " +
        market.payoutToken.symbol,
      subtext: !isNaN(market.maxPayoutUsd)
        ? usdFormatter.format(market.maxPayoutUsd)
        : "Unknown",
      sortValue: market.maxPayoutUsd,
    };
  },
};

const vesting: Column<CalculatedMarket> = {
  label: "Vesting",
  accessor: "vesting",
  formatter: (market) => {
    const isTerm = market.vestingType === "fixed-term";
    const sort = market.vesting * 1000;

    const term = market.formattedShortVesting.includes("Immediate")
      ? " Instant Swap"
      : market.formattedShortVesting + " Term";

    return {
      value: formatDate.short(new Date(sort)),
      subtext: isTerm ? term : "Fixed Expiry",
    };
  },
};

const creationDate: Column<CalculatedMarket> = {
  label: "Deployed on",
  accessor: "creationDate",
  width: "w-[15%]",
  formatter: (market) => ({
    value: formatDate.short(new Date(market.creationBlockTimestamp * 1000)),
    sortValue: market.creationBlockTimestamp,
  }),
};

const tbv: Column<CalculatedMarket> = {
  label: "TBV",
  accessor: "tbvUsd",
  width: "w-[7%]",
  formatter: (market) => {
    const digits = calculateTrimDigits(market.totalBondedAmount);
    const totalBondedAmount = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    })
      .format(market.totalBondedAmount)
      .concat(" " + market.quoteToken.symbol);

    return {
      value: !isNaN(market.tbvUsd)
        ? usdLongFormatter.format(market.tbvUsd)
        : totalBondedAmount,
      sortValue: market.tbvUsd,
    };
  },
};

export const base = [
  bondColumn,
  bondPrice,
  discountColumn,
  maxPayout,
  vesting,
  tbv,
];

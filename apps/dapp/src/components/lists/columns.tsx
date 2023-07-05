import { Button, Column, DiscountLabel, formatDate, Link } from "ui";
import { add } from "date-fns";
import {
  longFormatter,
  usdFormatter,
  usdLongFormatter,
} from "src/utils/format";
import {
  CalculatedMarket,
  calculateTrimDigits,
  CHAINS,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";
import { useNavigate } from "react-router-dom";

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
    const sort = isTerm
      ? add(Date.now(), { seconds: market.vesting })
      : market.vesting * 1000;

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
  alignEnd: true,
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

const issuer: Column<CalculatedMarket> = {
  label: "Issuer",
  accessor: "issuer",
  width: "w-[16%]",
  defaultSortOrder: "asc",
  formatter: (market) => {
    const { blockExplorerUrl } = getBlockExplorer(market.chainId, "address");
    const address = blockExplorerUrl + market.owner;
    const start = market.owner.substring(0, 4);
    const end = market.owner.substring(market.owner.length - 4);
    return {
      value: `${start}...${end}`,
      subtext: address,
      searchValue: address,
    };
  },
  Component: (props) => {
    return (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={props.subtext}
        onClick={(e: React.BaseSyntheticEvent) => {
          e.stopPropagation();
        }}
      >
        {props.value}
      </Link>
    );
  },
};

export const viewColumn: Column<CalculatedMarket> = {
  label: "",
  accessor: "view",
  alignEnd: true,
  width: "w-[10%]",
  unsortable: true,
  formatter: (market) => ({ value: market.marketId, subtext: market.chainId }),
  Component: (props: any) => {
    const navigate = useNavigate();

    return (
      <Button
        thin
        icon
        size="sm"
        variant="ghost"
        className="mr-4"
        onClick={(e: React.BaseSyntheticEvent) => {
          e.stopPropagation();
          e.preventDefault();
          const chainId = props.subtext;
          const marketId = props.value; //TODO: (afx) improve
          navigate(`/market/${chainId}/${marketId}`);
        }}
      >
        <div className="flex place-items-center">
          View
          <ArrowIcon height={16} width={16} className="my-auto rotate-180" />
        </div>
      </Button>
    );
  },
};

export const base = [bondColumn, bondPrice, discountColumn, maxPayout, vesting];
export const embedColumns = [
  bondColumn,
  bondPrice,
  discountColumn,
  maxPayout,
  vesting,
].map((e) => ({ ...e, width: undefined, alignEnd: false }));

export const marketList = [...base, tbv, issuer, viewColumn];
export const tokenMarketList = [...base, tbv, issuer, viewColumn];
export const userMarketList = [bondColumn];

export const mobileMarketLIst = [bondColumn, bondPrice, discountColumn].map(
  (c) => ({ ...c, width: undefined, alignEnd: false })
);

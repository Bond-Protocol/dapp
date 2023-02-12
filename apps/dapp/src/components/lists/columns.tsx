import { getProtocol } from "@bond-protocol/bond-library";
import { Button, Column, DiscountLabel } from "ui";
import { add } from "date-fns";
import {
  longFormatter,
  usdLongFormatter,
  usdFormatter,
} from "src/utils/format";
import { formatDate, getTokenDetailsForMarket } from "src/utils";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";
import { CHAINS } from "@bond-protocol/bond-library";

const bond: Column<CalculatedMarket> = {
  label: "Bond",
  accessor: "bond",
  width: "w-[13%]",
  formatter: (market) => {
    const { quote, lpPair } = getTokenDetailsForMarket(market);
    const chain = CHAINS.get(market.chainId);

    return {
      value: market.quoteToken.symbol,
      icon: quote?.logoUrl,
      lpPairIcon: lpPair?.logoUrl,
      chainChip: chain?.image,
    };
  },
};

const bondPrice: Column<CalculatedMarket> = {
  label: "Bond Price",
  accessor: "bondPrice",
  width: "w-[18%]",
  formatter: (market) => {
    const { payout } = getTokenDetailsForMarket(market);
    const value = market.formattedDiscountedPrice;
    const subtext = value ? market.formattedFullPrice + " Market" : "";

    return {
      icon: payout?.logoUrl,
      value,
      subtext,
    };
  },
};

const discount: Column<CalculatedMarket> = {
  label: "Discount",
  accessor: "discount",
  alignEnd: true,
  width: "w-[8%]",
  Component: DiscountLabel,
  formatter: (market) => {
    const value = market.discount + "%";
    return { value };
  },
};

const maxPayout: Column<CalculatedMarket> = {
  label: "Max Payout",
  accessor: "maxPayout",
  alignEnd: true,
  width: "w-[14%]",
  formatter: (market) => {
    const maxPayout = longFormatter.format(parseFloat(market.maxPayout));
    const value =
      parseFloat(maxPayout) > 0
        ? `${maxPayout} ${market.payoutToken.symbol}`
        : null;

    return {
      value,
      subtext: usdFormatter.format(market.maxPayoutUsd),
      sortValue: market.maxPayoutUsd.toString(),
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
      sortValue: sort.toString(),
    };
  },
};

const creationDate: Column<CalculatedMarket> = {
  label: "Deployed on",
  accessor: "creationDate",
  width: "w-[15%]",
  formatter: (market) => ({
    value: formatDate.short(new Date(market.creationBlockTimestamp * 1000)),
    sortValue: market.creationBlockTimestamp.toString(),
  }),
};

const tbv: Column<CalculatedMarket> = {
  label: "TBV",
  accessor: "tbvUsd",
  alignEnd: true,
  width: "w-[7%]",
  formatter: (market) => {
    return {
      value: usdFormatter.format(market.tbvUsd),
      sortValue: market.tbvUsd.toString(),
    };
  },
};

const issuer: Column<CalculatedMarket> = {
  label: "Issuer",
  accessor: "issuer",
  width: "w-[12%]",
  formatter: (market) => {
    const protocol = getProtocol(market.owner);
    return {
      value: protocol?.name,
      icon: protocol?.logoUrl,
    };
  },
};

const view: Column<CalculatedMarket> = {
  label: "",
  accessor: "view",
  alignEnd: true,
  unsortable: true,
  formatter: (market) => ({ value: market.marketId, subtext: market.chainId }),
  Component: (props: any) => (
    <Button
      thin
      icon
      size="sm"
      variant="ghost"
      className="mr-4"
      onClick={(e: React.BaseSyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const chainId = CHAINS.get(props.subtext)?.chainId;
        const marketId = props.value; //TODO: (afx) improve
        props.onClick(`/market/${chainId}/${marketId}`);
      }}
    >
      <div className="flex place-items-center">
        View
        <ArrowIcon height={16} width={16} className="my-auto rotate-180" />
      </div>
    </Button>
  ),
};

export const base = [bond, bondPrice, discount, maxPayout, vesting];
export const marketList = [...base, tbv, issuer, view];
export const issuerMarketList = [...base, creationDate, tbv, view];

import { getProtocol, getTokenByAddress } from "@bond-protocol/bond-library";
import { Button, Column, DiscountLabel } from "ui";
import { add } from "date-fns";
import { longFormatter, usdFormatter } from "src/utils/format";
import { formatDate, getTokenDetailsForMarket } from "src/utils";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";

const bond: Column<CalculatedMarket> = {
  label: "Bond",
  accessor: "bond",
  width: "w-[18%]",
  formatter: (market) => {
    const { quote, payout, lpPair } = getTokenDetailsForMarket(market);

    return {
      value: market.quoteToken.symbol + "-" + market.payoutToken.symbol,
      icon: quote?.logoUrl,
      pairIcon: payout?.logoUrl,
      lpPairIcon: lpPair?.logoUrl,
    };
  },
};

const bondPrice: Column<CalculatedMarket> = {
  label: "Bond Price",
  accessor: "bondPrice",
  width: "w-[14%]",
  formatter: (market) => {
    return {
      value: market.formattedDiscountedPrice,
      subtext: market.formattedFullPrice + " Market",
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
    return { value: market.discount + "%" };
  },
};

const maxPayout: Column<CalculatedMarket> = {
  label: "Max Payout",
  accessor: "maxPayout",
  alignEnd: true,
  width: "w-[14%]",
  formatter: (market) => {
    return {
      value: longFormatter.format(parseFloat(market.maxPayout)),
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

    return {
      value: formatDate.short(new Date(sort)),
      subtext: isTerm ? market.formattedShortVesting + " Term" : "Fixed Expiry",
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
  formatter: (market) => ({ value: market.marketId, subtext: market.network }),
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
        const network = props.subtext;
        const marketId = props.value; //TODO: (afx) improve
        props.onClick(`/market/${network}/${marketId}`);
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

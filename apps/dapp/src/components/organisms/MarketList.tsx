import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Button, Loading, Table, DiscountLabel, Column, Cell } from "ui";
import { useMarkets } from "hooks";
import { socials } from "..";
import { getProtocol, getToken } from "@bond-protocol/bond-library";
import { PageHeader } from "components/atoms/PageHeader";

type MarketListProps = {
  markets?: Map<string, CalculatedMarket>;
  allowManagement?: boolean;
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const tableColumns: Array<Column<CalculatedMarket>> = [
  {
    label: "Bond",
    accessor: "bond",
    unsortable: true,
    width: "w-[13%]",
    formatter: (market) => {
      const quoteToken = getToken("goerli_" + market.quoteToken.address);
      const payoutToken = getToken("goerli_" + market.payoutToken.address);
      return {
        value: market.quoteToken.symbol + "-" + market.payoutToken.symbol,
        icon: quoteToken?.logoUrl,
        pairIcon: payoutToken?.logoUrl,
        even: true,
      };
    },
  },
  {
    label: "Bond Price",
    accessor: "bondPrice",
    width: "w-[13%]",
    formatter: (market) => {
      return {
        value: usdFormatter.format(market.discountedPrice),
        subtext: usdFormatter.format(market.fullPrice) + " Market",
      };
    },
  },
  {
    label: "Discount",
    accessor: "discount",
    alignEnd: true,
    width: "w-[8%]",
    Component: DiscountLabel,
    formatter: (market) => {
      return { value: market.discount + "%" };
    },
  },
  {
    label: "Max Payout",
    accessor: "maxPayout",
    alignEnd: true,
    width: "w-[13%]",
    formatter: (market) => {
      return {
        value: market.maxPayout,
        subtext: usdFormatter.format(market.maxPayoutUsd),
      };
    },
  },
  {
    label: "Vesting",
    accessor: "vesting",
    formatter: (market) => {
      return {
        value: market.formattedLongVesting,
        sortValue: market.vesting.toString(),
      };
    },
  },
  { label: "Creation Date", accessor: "creationDate", width: "w-[15%]" },
  {
    label: "TBV",
    accessor: "tbvUsd",
    alignEnd: true,
    width: "w-[7%]",
    formatter: (market) => {
      return {
        value: usdFormatter.format(market.tbvUsd),
      };
    },
  },
  {
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
  },
  {
    label: "",
    accessor: "view",
    alignEnd: true,
    unsortable: true,
    formatter: (market) => ({ value: market.marketId }),
    Component: (props: any) => (
      <Button
        thin
        size="sm"
        variant="ghost"
        className="mr-4"
        onClick={() => {
          console.log("from button", { props });
          props.onClick("/market/" + props.value);
        }}
      >
        View
      </Button>
    ),
  },
];

const toValue = (v: any) => ({ value: v });

const marketToTableData = (market: CalculatedMarket): Record<string, Cell> => {
  return tableColumns.reduce((acc, { accessor, formatter }) => {
    //@ts-ignore
    const value = String(market[accessor]);
    return {
      ...acc,
      [accessor]: formatter ? formatter(market) : toValue(value),
    };
  }, {});
};

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  ...props
}) => {
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();

  const markets = props.markets || allMarkets;

  const tableMarkets = useMemo(
    () =>
      Array.from(markets.values())
        .map(marketToTableData)
        .map((m) => {
          //@ts-ignore
          m["view"].onClick = (v: string) => navigate(v);
          return m;
        }),
    [markets]
  );

  if (isLoading.market || isLoading.priceCalcs) {
    return <Loading content="markets" />;
  }

  if (
    Object.values(isLoading).some((loading) => loading) ||
    allMarkets.size === 0
  ) {
    return (
      <div className="flex flex-col">
        <div className="mt-20 text-center text-5xl uppercase leading-normal">
          No Bond Markets <br />
          are currently open
        </div>
        <div className="flex flex-col items-center justify-center pt-8">
          <a href={socials.discord} target="_blank">
            <Button>Join our Discord</Button>
          </a>
          <p className="pt-2 text-sm uppercase">for the latest updates</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={"Live Markets"} />
      <div className="pt-10">
        <Table columns={tableColumns} data={tableMarkets} />
      </div>
    </div>
  );
};

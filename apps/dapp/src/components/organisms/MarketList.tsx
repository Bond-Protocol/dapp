import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { getProtocol, getToken } from "@bond-protocol/bond-library";
import { Button, Loading, Table, DiscountLabel, Column } from "ui";
import { useMarkets } from "hooks";
import { socials } from "..";
import { usdFormatter } from "src/utils/format";
import { toTableData } from "src/utils/table";

const tableColumns: Array<Column<CalculatedMarket>> = [
  {
    label: "Bond",
    accessor: "bond",
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
        sortValue: market.maxPayoutUsd,
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
        onClick={() => props.onClick("/market/" + props.value)}
      >
        View
      </Button>
    ),
  },
];

type MarketListProps = {
  markets?: Map<string, CalculatedMarket>;
  issuer?: string;
  allowManagement?: boolean;
};

export const MarketList: FC<MarketListProps> = ({
  allowManagement,
  issuer,
  ...props
}) => {
  const navigate = useNavigate();
  const { allMarkets, isLoading } = useMarkets();

  const markets = props.markets || allMarkets;

  const tableMarkets = useMemo(
    () =>
      Array.from(markets.values())
        .map((m) => toTableData(tableColumns, m))
        .filter((m) => {
          return issuer ? issuer === m.issuer.value : true;
        })
        .map((m) => {
          //@ts-ignore
          m["view"].onClick = (path: string) => navigate(path);
          return m;
        }),
    [allMarkets, isLoading, issuer, tableColumns]
  );

  if (isLoading.market || isLoading.priceCalcs) {
    return <Loading content="markets" />;
  }

  const isSomeLoading = Object.values(isLoading).some((loading) => loading);

  if (isSomeLoading || allMarkets.size === 0) {
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

  return <Table columns={tableColumns} data={tableMarkets} />;
};

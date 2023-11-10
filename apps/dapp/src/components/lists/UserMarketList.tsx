import { CalculatedMarket, CHAINS } from "types";
import {
  Button,
  Column,
  dateMath,
  Filter,
  formatCurrency,
  formatDate,
  Label,
  PaginatedTable,
  StatusChip,
} from "ui";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";
import { CloseMarket } from "components";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "context/dashboard-context";
import { Market } from "src/generated/graphql";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

const hasMarketExpiredOrClosed = ({ conclusion, hasClosed }: Market) => {
  return (
    dateMath.isBefore(new Date(conclusion * 1000), new Date()) || hasClosed
  );
};

const endColumn: Column<CalculatedMarket> = {
  label: "End Date",
  accessor: "conclusion",
  tooltip:
    "The configured end date, however markets may be closed manually before it",
  formatter: (market) => {
    return {
      value: formatDate.short(new Date(Number(market.conclusion) * 1000)),
      sortValue: market.conclusion,
    };
  },
  Component: (props) => {
    const hasExpired = hasMarketExpiredOrClosed(props.data);
    const className = hasExpired ? "bg-red-500/80" : "bg-green-500/80";
    const content = hasExpired ? "Closed" : "Open";
    return (
      <div className="flex w-full flex-col justify-between gap-x-2">
        <Label value={props.value} />
        <StatusChip
          content={content}
          className={className + " " + "h-min w-[50px]"}
        />
      </div>
    );
  },
};

const receivedColumn = {
  label: "Received",
  accessor: "quote",
  formatter: (market: any) => {
    const quote = formatCurrency.longFormatter.format(market.total?.quote);
    const quoteUsd = formatCurrency.usdFormatter.format(market.total?.quoteUsd);
    const chain = CHAINS.get(market.chainId);
    return {
      value: quote + " " + market.quoteToken.symbol,
      subtext: quoteUsd,
      icon: market.quoteToken.logoURI,
      chainChip: chain?.image,
      sortValue: market.total?.quoteUsd,
    };
  },
};
const paidColumn = {
  label: "Paid",
  accessor: "payout",
  formatter: (market: any) => {
    console.log({ market });
    const payout = formatCurrency.longFormatter.format(market.total?.payout);
    const usdPayout = formatCurrency.usdFormatter.format(
      market.total?.payoutUsd
    );
    return {
      value: payout + " " + market.payoutToken.symbol,
      subtext: usdPayout,
      icon: market.payoutToken.logoURI,
      sortValue: market.total?.payoutUsd,
    };
  },
};
const totalBondColumn = {
  label: "Bonds",
  accessor: "bonds",
  width: "w-[8%]",
  alignEnd: true,
  tooltip: "Total bonds acquired / by unique addresses",
  formatter: (market: any) => {
    const total = market.bondPurchases?.length;
    const unique = new Set(
      market.bondPurchases?.map((p: any) => p.recipient.toLowerCase())
    ).size;
    return {
      value: total ? total : "-",
      subtext: total ? `/${unique}` : "",
    };
  },
};

const avgRateColumn = {
  label: "Avg Rate",
  accessor: "price",
  tooltip: "Average exchange rate at which bonds were purchased",
  formatter: (market: any) => {
    const hasPurchases = !!market.bondPurchases?.length;

    return {
      value: hasPurchases
        ? formatCurrency.trimToken(market.total?.avgPrice ?? 0)
        : "-",
      subtext: hasPurchases
        ? market.quoteToken.symbol + " per " + market.payoutToken.symbol
        : "",
    };
  },
};

export const closedMarketColumns = [
  {
    label: "Capacity",
    accessor: "capacity",
    formatter: (market: any) => {
      const capacityToken = market.capacityInQuote
        ? market.quoteToken
        : market.payoutToken;

      const capacity = formatUnits(market.capacity, capacityToken.decimals);

      return {
        value: `${formatCurrency.dynamicFormatter(
          capacity.toString(),
          false
        )} ${capacityToken.symbol}`,
        icon: capacityToken.logoURI,
      };
    },
  },

  receivedColumn,
  paidColumn,
  totalBondColumn,
  avgRateColumn,
  endColumn,
];

export const columns = {
  receivedColumn,
  paidColumn,
  totalBondColumn,
  avgRateColumn,
  endColumn,
};

const tableColumns = [
  ...closedMarketColumns,
  {
    label: "",
    accessor: "",
    formatter: (market: any) => {
      return {
        value: market,
      };
    },
    Component: (props: any) => {
      const navigate = useNavigate();
      const goToMarket = () => navigate(`/market/${chainId}/${marketId}`);
      const { chainId, marketId, hasClosed, conclusion } = props.value;
      const expired =
        dateMath.isBefore(new Date(conclusion * 1000), new Date()) || hasClosed;

      if (expired) {
        return <div />;
      }

      return (
        <div className="flex w-full gap-x-2">
          <CloseMarket market={props.value} />
          <Button
            thin
            size="sm"
            className="w-full"
            variant="ghost"
            onClick={() => goToMarket()}
          >
            <div className="flex place-items-center">
              View
              <ArrowIcon
                height={16}
                width={16}
                className="my-auto rotate-180"
              />
            </div>
          </Button>
        </div>
      );
    },
  },
];

export const UserMarketList = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const navigate = useNavigate();
  const dashboard = useDashboard();
  const [markets, setMarkets] = useState<Market[]>([]);
  console.log({ dashboard: dashboard.allMarkets });

  useEffect(() => {
    if (dashboard.allMarkets) {
      setMarkets(dashboard.allMarkets);
    }
  }, [dashboard.allMarkets]);

  const filters: Array<Filter> = [
    {
      id: "status",
      type: "switch",
      label: "Hide Closed Markets",
      startActive: dashboard.currentMarkets.length > 0,
      handler: (market) => {
        return (
          !dateMath.isBefore(new Date(market.conclusion * 1000), new Date()) &&
          !market.hasClosed
        );
      },
    },
  ];

  const fallback = {
    title: "No markets to show",
    buttonText: "Deploy a new Market",
    onClick: () => navigate("/create"),
  };

  return (
    <div className="flex flex-col gap-y-20">
      {!!dashboard.allMarkets.length && (
        <PaginatedTable
          title="Markets"
          defaultSort="conclusion"
          columns={tableColumns}
          data={markets}
          filters={filters}
          //@ts-ignore
          fallback={isTabletOrMobile ? { title: fallback.title } : fallback}
        />
      )}
    </div>
  );
};

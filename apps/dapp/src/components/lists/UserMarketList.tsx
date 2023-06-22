import { CalculatedMarket, CHAINS } from "@bond-protocol/contract-library";
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
import { ethers } from "ethers";
import { Market } from "src/generated/graphql";

const hasMarketExpiredOrClosed = ({ conclusion, hasClosed }: Market) => {
  return (
    dateMath.isBefore(new Date(conclusion * 1000), new Date()) || hasClosed
  );
};

const endColumn: Column<CalculatedMarket> = {
  label: "End Date",
  accessor: "conclusion",
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

const tableColumns = [
  {
    label: "Capacity",
    accessor: "capacity",

    formatter: (market: any) => {
      const capacityToken = market.capacityInQuote
        ? market.quoteToken
        : market.payoutToken;

      const capacity = ethers.utils.formatUnits(
        market.capacity,
        capacityToken.decimals
      );

      //const key = market.capacityInQuote ? "quote" : "payout";
      //const percentage = (market.total[key] / Number(capacity)) * 100;

      return {
        value: `${formatCurrency.dynamicFormatter(
          capacity.toString(),
          false
        )} ${capacityToken.symbol}`,
        icon: capacityToken.logoURI,
        //subtext: percentage.toFixed(2) + "%",
      };
    },
  },

  {
    label: "Received",
    accessor: "quote",
    formatter: (market: any) => {
      const quote = formatCurrency.longFormatter.format(market.total?.quote);
      const quoteUsd = formatCurrency.usdFormatter.format(
        market.total?.quoteUsd
      );
      const chain = CHAINS.get(market.chainId);
      return {
        value: quote + " " + market.quoteToken.symbol,
        subtext: quoteUsd,
        icon: market.quoteToken.logoURI,
        chainChip: chain?.image,
      };
    },
  },
  {
    label: "Paid",
    accessor: "payout",
    formatter: (market: any) => {
      const payout = formatCurrency.longFormatter.format(market.total?.payout);
      const usdPayout = formatCurrency.usdFormatter.format(
        market.total?.payoutUsd
      );
      return {
        value: payout + " " + market.payoutToken.symbol,
        subtext: usdPayout,
        icon: market.payoutToken.logoURI,
      };
    },
  },
  {
    label: "Bonds",
    accessor: "bonds",
    width: "w-[8%]",
    alignEnd: true,
    tooltip: "Total bonds acquired / by unique addresses",
    formatter: (market: any) => {
      const total = market.bondPurchases.length;
      const unique = new Set(
        market.bondPurchases.map((p: any) => p.recipient.toLowerCase())
      ).size;
      return {
        value: total ? total : "-",
        subtext: total ? `/${unique}` : "",
      };
    },
  },

  {
    label: "Avg Rate",
    accessor: "price",
    tooltip: "Average exchange rate at which bonds were purchased",
    formatter: (market: any) => {
      //const avgUsd = market.total.avgPrice * market.payoutToken.price;
      const hasPurchases = !!market.bondPurchases?.length;

      return {
        value: hasPurchases
          ? formatCurrency.trimToken(market.total?.avgPrice)
          : "-",
        subtext: hasPurchases
          ? market.quoteToken.symbol + " per " + market.payoutToken.symbol
          : "",
      };
    },
  },

  endColumn,
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
  const navigate = useNavigate();
  const dashboard = useDashboard();

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

  return (
    <div className="flex flex-col gap-y-20">
      {!!dashboard.allMarkets.length && (
        <PaginatedTable
          title="Markets"
          defaultSort="conclusion"
          columns={tableColumns}
          data={dashboard.allMarkets}
          filters={filters}
          //@ts-ignore
          fallback={{
            title: "No markets to show",
            buttonText: "Deploy a new Market",
            onClick: () => navigate("/create"),
          }}
        />
      )}
    </div>
  );
};

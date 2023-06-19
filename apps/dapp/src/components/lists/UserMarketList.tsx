import { CalculatedMarket, CHAINS } from "@bond-protocol/contract-library";
import {
  Button,
  Column,
  dateMath,
  Filter,
  formatCurrency,
  formatDate,
  PaginatedTable,
} from "ui";
import { bondColumn, discountColumn } from "./columns";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";
import { CloseMarket } from "components";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "context/dashboard-context";
import { ethers } from "ethers";

const endColumn: Column<CalculatedMarket> = {
  label: "End Date",
  accessor: "conclusion",
  formatter: (market) => {
    return {
      value: formatDate.short(new Date(Number(market.conclusion) * 1000)),
      sortValue: market.conclusion,
    };
  },
};

export const tableColumns: Array<Column<CalculatedMarket>> = [
  bondColumn,
  {
    label: "Payout",
    accessor: "payout",
    formatter: (market) => {
      return {
        value: market.payoutToken.symbol,
        icon: market.payoutToken.logoURI,
      };
    },
  },
  {
    label: "Capacity",
    accessor: "capacity",
    formatter: (market) => {
      const total = formatCurrency.longFormatter.format(
        Number(market.totalPayoutAmount) + Number(market.currentCapacity)
      );
      const remaining = formatCurrency.longFormatter.format(
        market.currentCapacity
      );

      return {
        value: `${remaining} ${market.capacityToken}`,
        subtext: `Total: ${total} ${market.capacityToken}`,
      };
    },
  },
  {
    label: "Received",
    accessor: "assets",
    formatter: (market) => {
      return {
        value:
          formatCurrency.longFormatter.format(market.totalBondedAmount) +
          " " +
          market.quoteToken.symbol,
        subtext: formatCurrency.usdFormatter.format(
          Number(market.formattedTbvUsd)
        ),
      };
    },
  },
  discountColumn,
  endColumn,
  {
    label: "",
    accessor: "",
    //@ts-ignore
    formatter: (market) => {
      return {
        value: market,
      };
    },
    Component: (props) => {
      const navigate = useNavigate();
      const { chainId, marketId } = props.value;
      const goToMarket = () => navigate(`/market/${chainId}/${marketId}`);

      return (
        <div className="flex gap-x-2">
          <CloseMarket market={props.value} />
          <Button thin size="sm" variant="ghost" onClick={() => goToMarket()}>
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

const closedColumns = [
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
    label: "Avg Rate",
    accessor: "price",
    alignEnd: true,
    tooltip: "Average exchange rate at which bonds were purchased",
    formatter: (market: any) => {
      //const avgUsd = market.total.avgPrice * market.payoutToken.price;
      return {
        value: formatCurrency.trimToken(market.total.avgPrice),
        subtext: market.quoteToken.symbol + " per " + market.payoutToken.symbol,
      };
    },
  },

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
        //subtext: percentage.toFixed(2) + "%",
      };
    },
  },
  {
    label: "Bonds",
    accessor: "bonds",
    width: "w-[8%]",
    tooltip: "Total bonds acquired / by unique addresses",
    formatter: (market: any) => {
      const total = market.bondPurchases.length;
      const unique = new Set(
        market.bondPurchases.map((p: any) => p.recipient.toLowerCase())
      ).size;
      return {
        value: total,
        subtext: `/${unique}`,
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
        return (
          <Button thin size="sm" disabled variant="ghost">
            Market Closed
          </Button>
        );
      }
      return (
        <div className="flex gap-x-2">
          <CloseMarket market={props.value} />
          <Button thin size="sm" variant="ghost" onClick={() => goToMarket()}>
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
          columns={closedColumns}
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

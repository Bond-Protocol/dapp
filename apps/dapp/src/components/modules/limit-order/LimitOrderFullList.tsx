import { ACTIVE_CHAIN_IDS } from "context/evm-provider";
import { useMarkets } from "context/market-context";
import { useQueries } from "react-query";
import { useOrderApi } from "./use-order-api";
import { OrderConfig, orderService } from "services/order-service";
import {
  PaginatedTable,
  TokenLogo,
  Column,
  Button,
  getDiscountPercentage,
  getDiscountColor,
  formatCurrency,
  formatDate,
} from "ui";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { ethers } from "ethers";

const Chip = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={`rounded-full border bg-white/5 px-2 font-mono text-sm font-light uppercase ${className}`}
  >
    {children}
  </div>
);

export const limitOrderBaseColumns: Column<
  OrderConfig & { market: CalculatedMarket }
>[] = [
  {
    label: "Limit Price",
    accessor: "price",
    tooltip:
      "The USD price of the asset at which you expect the order to execute",
    formatter: (order) => {
      const totalValue =
        Number(order.amount) * Number(order.market?.quoteToken?.price);
      const price = totalValue / Number(order.min_amount_out);

      const discount = getDiscountPercentage(
        order.market.payoutToken?.price ?? 0,
        Number(price)
      );

      const color = getDiscountColor(
        discount,
        order.market?.payoutToken?.price ?? 0
      );

      return {
        value: formatCurrency.usdFullFormatter.format(price),
        subtext: <span className={color}>{discount.toFixed(2) ?? "??"}%</span>,
      };
    },
  },
  {
    label: "Bond Amount",
    accessor: "amount",
    formatter: (order) => {
      const amount =
        Number(order.amount) < 1000
          ? formatCurrency.trimToken(order.amount)
          : formatCurrency.longFormatter.format(Number(order.amount));
      return {
        value: amount,
        sortValue: order.amount,
        subtext: (
          <span className="text-xs">{order.market?.quoteToken.symbol}</span>
        ),
      };
    },
  },
];

export const limitOrderExpiryColumn = {
  label: "Expires",
  accessor: "expiry",
  alignEnd: true,
  formatter: (order: any) => {
    const deadline = new Date(Number(order.deadline) * 1000);

    const timeInterval = formatDate.interval(new Date(), deadline);

    if (order.status === "Executed") {
      return {
        sortValue: 0,
        value: <Chip className="border-light-success">Executed</Chip>,
      };
    }

    if (order.status === "Cancelled") {
      return {
        sortValue: -1,
        value: <Chip className="border-light-alert">Canceled</Chip>,
      };
    }

    return {
      sortValue: deadline.getTime(),
      value: timeInterval,
    };
  },
};

export const columns: Column<OrderConfig & { market: CalculatedMarket }>[] = [
  {
    label: "Market",
    accessor: "market",
    formatter: (order: any) => {
      const { quoteToken, payoutToken } = order.market;

      const value = `${payoutToken.symbol}-${quoteToken.symbol}`;
      return {
        searchValue: value,
        value: (
          <div className="flex items-center gap-x-2">
            <TokenLogo
              icon={payoutToken.logoURI}
              pairIcon={quoteToken.logoURI}
            />
            <div className="font-fraktion text-lg font-bold">{value}</div>
          </div>
        ),
      };
    },
  },
  ...limitOrderBaseColumns,
  {
    label: "Filled",
    accessor: "filled",
    tooltip: "How much of the order has been filled",
    formatter: (order: any) => {
      const value = ethers.utils.formatUnits(
        order.filled,
        order.market.quoteToken.decimals
      );
      return {
        value,
      };
    },
  },
  limitOrderExpiryColumn,
  {
    label: "",
    accessor: "cancel",
    alignEnd: true,
    width: "w-[8%]",
    formatter: (args: any) => args,
    Component: (order: any) => {
      const api = useOrderApi();
      const onCancel = async () => {
        await api.cancelOrder(order.digest, order.market_id);
      };

      if (order.status === "Active") {
        return (
          <Button onClick={onCancel} size="sm" thin variant="ghost">
            Cancel{" "}
          </Button>
        );
      }

      return <div />;
    },
  },
];

const filters = [
  {
    type: "switch",
    id: "cancelled",
    label: "Hide Cancelled",
    startActive: true,
    handler: (order: any) => order.status !== "Cancelled",
  },
  {
    type: "switch",
    id: "executed",
    label: "Hide Executed",
    handler: (order: any) => order.status !== "Executed",
  },
];

export const LimitOrderFullList = () => {
  const orders = useOrderApi();
  const { everyMarket } = useMarkets();
  const queries = useQueries(
    ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/list-all", chainId],
      queryFn: () =>
        orders.listRaw(chainId).then((result) => {
          return result.map((order) => {
            const market = everyMarket.find(
              //@ts-ignore
              (mkt) => Number(mkt.marketId) === Number(order.market_id)
            );
            if (!market) {
              return order;
            }
            return {
              ...orderService.parseOrder(order, market),
              market,
            };
          });
        }),
      enabled: everyMarket.length > 0,
    }))
  );

  const allOrders =
    queries
      .flatMap((q) => q.data)
      .filter((q) => !!q)
      //@ts-ignore
      .sort((a, b) => b.deadline - a.deadline) ?? [];

  return (
    <div className="mt-10">
      <PaginatedTable
        //@ts-ignore
        filters={filters}
        loading={queries.every((q) => q.isLoading)}
        title="Orders"
        emptyRows={0}
        data={allOrders}
        columns={columns}
      />
    </div>
  );
};

import { ACTIVE_CHAIN_IDS } from "context/blockchain-provider";
import { useMarkets } from "context/market-context";
import { useQueries } from "react-query";
import { useOrderApi } from "./use-order-api";
import { OrderConfig, orderService } from "services/order-service";
import {
  PaginatedTable,
  Column,
  Button,
  getDiscountColor,
  formatCurrency,
  formatDate,
  Label,
} from "ui";
import { CalculatedMarket } from "@bond-protocol/types";
import { useNavigate } from "react-router-dom";
import { getDiscountPercentage } from "../create-market";
import { formatUnits } from "viem";
import { getChain } from "@bond-protocol/contract-library";

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
        order.market?.payoutToken?.price ?? 0,
        price
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
  formatter: (order: any) => {
    const deadline = new Date(Number(order.deadline) * 1000);

    const timeInterval = formatDate.interval(new Date(), deadline);

    if (order.status === "Executed") {
      return {
        sortValue: 0,
        value: (
          <Chip className="border-light-success text-light-success">
            Executed
          </Chip>
        ),
      };
    }

    if (order.status === "Cancelled") {
      return {
        sortValue: -1,
        value: (
          <Chip className="border-light-alert text-light-alert">Canceled</Chip>
        ),
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
    Component: (props) => {
      const navigate = useNavigate();
      const order = props.data;
      return (
        <Label
          className="cursor-pointer hover:underline"
          onClick={() =>
            navigate(`/market/${order.chain_id}/${order.market_id}`)
          }
          {...props}
        />
      );
    },
    formatter: (order: any) => {
      const { quoteToken, payoutToken } = order.market;

      const value = `${payoutToken.symbol}-${quoteToken.symbol}`;

      return {
        searchValue: value,
        value,
        pairIcon: quoteToken.logoURI,
        icon: payoutToken.logoURI,
      };
    },
  },
  ...limitOrderBaseColumns,
  {
    label: "Filled",
    accessor: "filled",
    tooltip: "How much of the order has been filled",
    formatter: (order: any) => {
      const value = formatUnits(order.filled, order.market.quoteToken.decimals);
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
        await api.cancelOrder(order.digest, order.chain_id);
        order.refetch();
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
  const { everyMarket, isSomeLoading, arePastMarketsLoading } = useMarkets();

  const enabled =
    !isSomeLoading && !arePastMarketsLoading && everyMarket.length > 0;

  const queries = useQueries(
    ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/list-all", chainId],
      queryFn: async () => {
        const result = await orders.listRaw(chainId);
        return result.map((order) => {
          const market = everyMarket.find(
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
      },
      enabled,
    }))
  );

  const allOrders =
    queries
      .flatMap((q) => q.data)
      //@ts-ignore
      .filter((q) => !!q && q.market)
      .map((d) => {
        //@ts-ignore
        d.refetch = () => queries.forEach((q) => q.refetch());
        return d;
      })

      //@ts-ignore
      .sort((a, b) => b?.deadline - a?.deadline) ?? [];

  return (
    <PaginatedTable
      //@ts-ignore
      filters={filters}
      loading={
        queries.every((q) => q.isIdle) || queries.every((q) => q.isLoading)
      }
      title="Orders"
      emptyRows={0}
      data={allOrders}
      columns={columns}
    />
  );
};

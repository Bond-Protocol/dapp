import {
  Button,
  Column,
  formatCurrency,
  formatDate,
  getDiscountColor,
  getDiscountPercentage,
  Icon,
  useSorting,
  Table,
  toTableData,
} from "ui";

import dotsVerticalIcon from "assets/icons/dots-vertical.svg";
import { useEffect, useState } from "react";
import { Popper } from "components/common/Popper";
import { useOrderApi } from "services/limit-order/use-order-api";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Order } from "src/types/openapi";

export type LimitOrderListProps = {
  market: CalculatedMarket;
  onClickPlaceOrder: () => void;
};

const columns: Column<Order & { market: CalculatedMarket }>[] = [
  {
    label: "Limit Price",
    accessor: "price",
    width: "w-[33%]",
    tooltip: "Limit order tooltip",
    formatter: (order) => {
      const totalValue =
        Number(order.amount) * Number(order.market.quoteToken.price);
      const price = totalValue / Number(order.min_amount_out);

      const discount = getDiscountPercentage(
        order.market.payoutToken.price ?? 0,
        Number(price)
      );

      const color = getDiscountColor(discount, order.marketPrice ?? 0);

      return {
        value: formatCurrency.trimToken(price),
        subtext: <span className={color}>{discount.toFixed(2) ?? "??"}%</span>,
      };
    },
  },
  {
    label: "Bond Amount",
    accessor: "amount",
    width: "w-[33%]",
    formatter: (order) => {
      const amount =
        order.amount < 1000
          ? formatCurrency.trimToken(order.amount)
          : formatCurrency.longFormatter.format(Number(order.amount));
      return {
        value: amount,
        sortValue: order.amount,
        subtext: (
          <span className="text-xs">{order.market.quoteToken.symbol}</span>
        ),
      };
    },
  },
  {
    label: "Expires",
    accessor: "expiry",
    width: "w-[33%]",
    alignEnd: true,
    formatter: (order) => {
      const result = formatDate.interval(new Date(), order.deadline);
      return {
        sortValue: order.deadline.getTime(),
        value: result,
      };
    },
  },
  {
    label: "",
    accessor: "close",
    width: "w-[12%]",
    formatter: (order) => {
      return { value: order.price };
    },
    Component: (props) => {
      const api = useOrderApi(props.data.market);

      return (
        <div key={props.key} className="relative">
          <Popper
            TriggerElement={({ onClick }) => (
              //@ts-ignore
              <div onClick={onClick} className="relative right-1.5">
                <Icon
                  className="hover:cursor-pointer"
                  width={24}
                  src={dotsVerticalIcon}
                />
              </div>
            )}
          >
            <div className="w-full rounded-lg bg-light-tooltip p-4">
              <Button
                variant="ghost"
                onClick={() => {
                  api.cancelOrder(props.data.digest);
                }}
              >
                Cancel Order
              </Button>
            </div>
          </Popper>
        </div>
      );
    },
  },
];

export const LimitOrderList = (props: LimitOrderListProps) => {
  const orderApi = useOrderApi(props.market);
  const [cols, setCols] = useState<any[]>([]);

  useEffect(() => {
    async function loadList() {
      //@ts-ignore
      const data: Order[] = await orderApi.list();
      const withMarket = data
        .filter(
          (order) =>
            order?.status === "Active" &&
            order.market_id === props.market.marketId
        )
        .map((d) => ({ ...d, market: props.market }));

      setCols(withMarket);
    }

    loadList();
  }, []);

  const [sortedData, sort] = useSorting(
    cols.map((r) => toTableData(columns, r))
  );

  return (
    <div className="h-full p-4 ">
      <div className="flex justify-between p-4 pb-2 pt-0 font-fraktion uppercase">
        <h4 className="text-2xl font-semibold ">Open Orders</h4>
        <button
          onClick={() =>
            orderApi.cancelAllOrders(props.market?.marketId?.toString())
          }
          className="my-auto font-bold uppercase tracking-widest transition-all hover:text-light-secondary"
        >
          Cancel All
        </button>
      </div>
      <div className="h-full max-h-[300px] w-full overflow-y-auto">
        <Table
          handleSorting={sort}
          className="w-full border-collapse backdrop-blur"
          headClassName="sticky child:w-full top-0 w-full border-none bg-light-base bg-gradient-to-r from-white/5 to-white/5"
          bodyClassName="overflow-y-auto "
          emptyRows={0}
          data={sortedData}
          columns={columns}
        />
        {!sortedData.length && (
          <div className="mt-8 flex h-[80%] flex-col items-center justify-center text-center ">
            <div>
              <div className="my-auto text-2xl">
                You don't have any orders yet
              </div>
              <Button className="mt-4" onClick={props.onClickPlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

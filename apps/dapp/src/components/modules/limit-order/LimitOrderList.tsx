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
  Loading,
  Modal,
} from "ui";

import dotsVerticalIcon from "assets/icons/dots-vertical.svg";
import { useEffect, useState } from "react";
import { Popper } from "components/common/Popper";
import { useOrderApi } from "./use-order-api";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Order } from "src/types/openapi";
import { OrderConfig } from "services/order-service";
import { useQuery } from "react-query";
import { useLimitOrderForMarket } from "./use-limit-order";

export type LimitOrderListProps = {
  market: CalculatedMarket;
  onClickPlaceOrder: () => void;
};

const columns: Column<OrderConfig & { market: CalculatedMarket }>[] = [
  {
    label: "Limit Price",
    accessor: "price",
    width: "w-[33%]",
    tooltip:
      "The USD price of the asset at which you expect the order to execute",
    formatter: (order) => {
      const totalValue =
        Number(order.amount) * Number(order.market?.quoteToken.price);
      const price = totalValue / Number(order.min_amount_out);

      const discount = getDiscountPercentage(
        order.market.payoutToken.price ?? 0,
        Number(price)
      );

      const color = getDiscountColor(
        discount,
        order.market?.payoutToken.price ?? 0
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
    width: "w-[33%]",
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
  {
    label: "Expires",
    accessor: "expiry",
    width: "w-[33%]",
    alignEnd: true,
    formatter: (order) => {
      const deadline = new Date(Number(order.deadline) * 1000);

      const timeInterval = formatDate.interval(
        new Date(),
        new Date(Number(order.deadline) * 1000)
      );

      return {
        sortValue: new Date(deadline).getTime(),
        value: timeInterval,
      };
    },
  },
  {
    label: "",
    accessor: "close",
    width: "w-[12%]",
    formatter: (args: any) => ({ value: args, data: args }),
    Component: (props: any) => {
      const api = useOrderApi();
      const { orders, market } = useLimitOrderForMarket();

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
                onClick={async () => {
                  console.log({ props, market });
                  await api.cancelOrder(
                    props.data.digest,
                    Number(market.chainId)
                  );

                  orders?.query?.refetch();
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
  const orderApi = useOrderApi();
  const { orders } = useLimitOrderForMarket();
  const [cancelingAll, setCancellingAll] = useState(false);

  const [sortedData, sort] = useSorting(
    orders.list.map((r) => toTableData(columns, r))
  );

  return (
    <div className="h-full p-4 ">
      <Modal
        open={cancelingAll}
        title="Cancel all orders"
        onClickClose={() => setCancellingAll(false)}
      >
        <div className="p-4">
          <div className="text-center ">
            This action will cancel all orders, are you sure?
          </div>
          <div className="mt-2 text-center text-sm text-light-grey-400">
            (It won't cost any gas)
          </div>
          <div className="mt-6 flex w-full justify-center gap-x-2">
            <Button
              size="lg"
              className="w-1/2"
              variant="ghost"
              onClick={() => setCancellingAll(false)}
            >
              Go back
            </Button>
            <Button
              size="lg"
              className="w-1/2"
              onClick={async () => {
                try {
                  await orderApi.cancelAllOrders(
                    props.market?.marketId?.toString(),
                    Number(props.market.chainId)
                  );
                  orders.query.refetch();
                } catch (e) {
                  console.error(e);
                } finally {
                  setCancellingAll(false);
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <div className="flex justify-between p-4 pb-2 pt-0 font-fraktion uppercase">
        <h4 className="text-2xl font-semibold ">Open Orders</h4>
        <button
          onClick={() => setCancellingAll(true)}
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
              {orders.isLoading ? (
                <div className="my-auto text-2xl">Loading your orders</div>
              ) : (
                <>
                  <div className="my-auto text-2xl">
                    You don't have any orders yet
                  </div>
                  <Button className="mt-4" onClick={props.onClickPlaceOrder}>
                    Place Order
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

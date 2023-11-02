import {
  Button,
  Column,
  formatCurrency,
  formatDate,
  getDiscountColor,
  Icon,
  useSorting,
  Table,
  toTableData,
  Modal,
} from "ui";

import dotsVerticalIcon from "assets/icons/dots-vertical.svg";
import { useEffect, useState } from "react";
import { Popper } from "components/common/Popper";
import { useOrderApi } from "./use-order-api";
import { CalculatedMarket } from "types";
import { OrderConfig } from "services/order-service";
import { useLimitOrderForMarket } from "./use-limit-order";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { getDiscountPercentage } from "../create-market";

export type LimitOrderListProps = {
  market?: CalculatedMarket;
  showAll?: boolean;
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
        order.market?.payoutToken.price ?? 0,
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

const ReApproveAllowanceCard = (props: {
  market: CalculatedMarket;
  onSubmit: () => void;
  requiredAllowance: string;
  currentAllowance: string;
}) => (
  <div className="item absolute inset-0  top-32 flex flex-col justify-center">
    <div className="z-20 flex w-full flex-col items-center justify-center ">
      <div className="font-fraktion text-2xl font-bold uppercase">
        Re-Approve Token to enable Orders
      </div>
      <div className="mt-4">
        You have revoked approval of {props.market.quoteToken.symbol}
      </div>
      {Number(props.currentAllowance) > 0 && (
        <div className="my-2 text-sm text-light-grey-400">
          You have approved{" "}
          {formatCurrency.dynamicFormatter(props.currentAllowance, false)} out
          of
          {formatCurrency.dynamicFormatter(props.requiredAllowance, false)}{" "}
          {props.market.quoteToken.symbol} required
        </div>
      )}
      <Button onClick={props.onSubmit}>Approve</Button>
    </div>
  </div>
);

export const LimitOrderListForMarket = (props: LimitOrderListProps) => {
  const orderApi = useOrderApi();
  const { orders, allowance } = useLimitOrderForMarket();
  const [cancelingAll, setCancellingAll] = useState(false);

  const [sortedData, sort] = useSorting(
    orders.list.map((r) => toTableData(columns, r))
  );

  const showReApprove = !allowance.hasSuffiencentAllowanceForAllOrders;

  return (
    <div className="h-full p-4 ">
      <Modal
        open={cancelingAll}
        title="Cancel all orders"
        onClickClose={() => setCancellingAll(false)}
      >
        <CancelOrderDialog
          onCancel={() => setCancellingAll(false)}
          onSubmit={async () => {
            try {
              await orderApi.cancelAllOrders(
                props.market?.marketId?.toString() ?? "",
                Number(props.market?.chainId)
              );
              orders.query.refetch();
            } catch (e) {
              console.error(e);
            } finally {
              setCancellingAll(false);
            }
          }}
        />
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
        {showReApprove && (
          <div className="relative z-10">
            <ReApproveAllowanceCard
              //@ts-ignore
              market={props.market}
              requiredAllowance={allowance.requiredAllowance}
              currentAllowance={allowance.allowance}
              onSubmit={allowance.approveRequiredAmount}
            />
          </div>
        )}

        <Table
          handleSorting={sort}
          className={`w-full border-collapse backdrop-blur ${
            showReApprove ? "blur" : ""
          }`}
          headClassName="sticky child:w-full top-0 w-full border-none bg-light-base bg-gradient-to-r from-white/5 to-white/5"
          bodyClassName="overflow-y-auto "
          emptyRows={0}
          data={sortedData}
          columns={columns}
        />
        {!sortedData.length && !showReApprove && (
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

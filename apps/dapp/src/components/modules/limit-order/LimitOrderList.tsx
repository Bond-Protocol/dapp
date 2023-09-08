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
import { useMemo, useState } from "react";
import { Popper } from "components/common/Popper";

export type LimitOrderListProps = {
  orders: Order[];
  onCancelAll: () => void;
};

type Order = {
  id?: number;
  marketPrice?: number;
  price: string | number;
  discount: string | number;
  amount: string | number;
  symbol: string;
  expiry: Date;
};

const columns: Column<Order>[] = [
  {
    label: "Limit Price",
    accessor: "price",
    width: "w-[33%]",
    tooltip: "Limit order tooltip",
    formatter: (order) => {
      const discount = getDiscountPercentage(
        order.marketPrice ?? 0,
        Number(order.price)
      );

      const color = getDiscountColor(order.marketPrice ?? 0, discount);

      return {
        value: order.price,
        subtext: <span className={color}>•{discount.toFixed(2) ?? "??"}%</span>,
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
        subtext: <span className="text-xs">{order.symbol}</span>,
      };
    },
  },
  {
    label: "Expires",
    accessor: "expiry",
    width: "w-[33%]",
    alignEnd: true,
    formatter: (order) => {
      const result = formatDate.interval(new Date(), order.expiry);
      return {
        sortValue: order.expiry.getTime(),
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
      //const order = useLimitOrder();
      //return <div>ok</div>;
      return (
        <div key={props.key} className="relative">
          <Popper
            TriggerElement={({ onClick }) => (
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
              <Button variant="ghost">Cancel Order</Button>
            </div>
          </Popper>
        </div>
      );
    },
  },
];

const sampleData = [
  {
    price: 80,
    discount: "2.14",
    amount: "20000000",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 9, 9, 0),
  },
  {
    price: 72,
    discount: "8.14",
    amount: "0.0012340234",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 18, 5, 43),
  },

  {
    price: 80,
    discount: "2.14",
    amount: "0.000001234234",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 15, 11, 32),
  },
  {
    price: 74,
    discount: "8.14",
    amount: "400",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 28, 10, 0),
  },

  {
    price: 81,
    discount: "2.14",
    amount: "200",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 8, 11, 0),
  },
  {
    price: 77,
    discount: "8.14",
    amount: "40000000000",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 8, 11, 0),
  },
].map((d) => ({ ...d, marketPrice: 82 }));

export const LimitOrderList = (props: LimitOrderListProps) => {
  const data = useMemo(
    () => (props.orders || sampleData).map((o) => toTableData(columns, o)),
    [props.orders]
  );

  const [cols, setCols] = useState<any[]>(sampleData);

  const [sortedData, sort] = useSorting(
    cols.map((r) => toTableData(columns, r))
  );

  // useEffect(() => {
  //   let interval: any;
  //   //if (!!props.orders.length && !cols.length) {
  //   interval = setInterval(() => {
  //     const previous = !!cols.length ? cols : props.orders;

  //     const updated = previous.map((o) => ({
  //       ...o,
  //       expiry: addSeconds(o.expiry, 1),
  //     }));
  //     setCols(updated);
  //   }, 1000);
  //   //}

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between p-4 pb-2 pt-0 font-fraktion uppercase">
        <h4 className="text-2xl font-semibold ">Open Orders</h4>
        <button
          onClick={props.onCancelAll}
          className="my-auto font-bold uppercase tracking-widest transition-all hover:text-light-secondary"
        >
          Cancel All
        </button>
      </div>
      <div className="max-h-64 w-full overflow-y-auto">
        <Table
          handleSorting={sort}
          className="w-full border-collapse backdrop-blur"
          headClassName="sticky child:w-full top-0 w-full border-none bg-light-base bg-gradient-to-r from-white/5 to-white/5"
          bodyClassName="overflow-y-auto "
          emptyRows={0}
          data={sortedData}
          columns={columns}
        />
      </div>
    </div>
  );
};

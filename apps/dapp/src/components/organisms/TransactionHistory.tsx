import { format } from "date-fns";
import { CHAIN_ID, getToken } from "@bond-protocol/bond-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useListBondPurchasesPerMarketQuery } from "src/generated/graphql";
import { toTableData } from "src/utils/table";
import { Column, Table } from "ui";
import { usdFormatter } from "src/utils/format";

const userTxsHistory: Column<any>[] = [
  {
    accessor: "market",
    label: "Market",
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
    accessor: "totalValue",
    label: "Total Value",
    alignEnd: true,
    formatter: (purchase) => {
      return {
        value: usdFormatter.format(
          parseFloat(purchase.payout) * parseFloat(purchase.purchasePrice)
        ),
      };
    },
  },
  {
    accessor: "amount",
    label: "Bond Amount",
    alignEnd: true,
    formatter: (purchase) => {
      return {
        value: `${parseFloat(purchase.amount).toFixed(2)} ${
          purchase.quoteToken.symbol
        }`,
      };
    },
  },
  {
    accessor: "payout",
    label: "Payout Amount",
    alignEnd: true,
    formatter: (purchase) => {
      return {
        value: `${parseFloat(purchase.payout).toFixed(2)} ${
          purchase.payoutToken.symbol
        }`,
      };
    },
  },
  {
    accessor: "timestamp",
    label: "Time",
    formatter: (purchase) => {
      const timestamp = new Date(purchase.timestamp * 1000);
      const date = format(timestamp, "MM.dd.yyyy");
      const time = format(timestamp, "kk:mm zzz");
      return { value: date, subtext: time };
    },
  },
];

const marketTxsHistory: Column<any>[] = [
  ...userTxsHistory,
  {
    accessor: "recipient",
    label: "Address",
    formatter: (purchase) => {
      const address = purchase.recipient;
      const start = address.substring(0, 6);
      const end = address.substring(address.length - 4);
      return {
        value: `${start}...${end}`,
      };
    },
  },
];

export interface TransactionHistoryProps {
  market: CalculatedMarket;
  className?: string;
}

export const TransactionHistory = (props: TransactionHistoryProps) => {
  const { data, ...query } = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[props?.market?.network as CHAIN_ID] },
    { marketId: props.market.id }
  );
  console.log({
    creationDate: props?.market.creationDate,
    market: props.market,
  });

  const tableData = data?.bondPurchases
    .filter((p) => p.timestamp > props.market.creationBlockTimestamp) // Avoids fetching markets with the same id from old contracts
    .map((p) => toTableData(marketTxsHistory, p));

  return (
    <div className={props.className}>
      <p className="ml-4 py-4 font-fraktion text-2xl uppercase">
        Transaction History
      </p>
      <Table
        loading={query.isLoading}
        columns={marketTxsHistory}
        data={tableData}
      />
    </div>
  );
};

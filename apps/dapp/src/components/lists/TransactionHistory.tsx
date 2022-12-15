import { format } from "date-fns";
import { CHAIN_ID } from "@bond-protocol/bond-library";
import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useListBondPurchasesPerMarketQuery } from "src/generated/graphql";
import { toTableData } from "src/utils/table";
import { Link, Column, Table } from "ui";
import { usdFormatter } from "src/utils/format";
import { getTokenDetailsForMarket } from "src/utils";

const userTxsHistory: Column<any>[] = [
  {
    accessor: "market",
    label: "Market",
    formatter: (purchase) => {
      const { quote, payout, lpPair } = getTokenDetailsForMarket(
        purchase?.market
      );

      return {
        value: purchase.quoteToken.symbol + "-" + purchase.payoutToken.symbol,
        icon: quote?.logoUrl,
        pairIcon: payout?.logoUrl,
        lpPairIcon: lpPair?.logoUrl,
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
      return { sortValue: timestamp, value: date, subtext: time };
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
      const start = address.substring(0, 4);
      const end = address.substring(address.length - 4);
      return {
        value: `${start}...${end}`,
        subtext: purchase.addressUrl,
      };
    },
    Component: (props) => {
      return <Link href={props.subtext}>{props.value}</Link>;
    },
  },
  {
    accessor: "blockExplorerUrl",
    label: "Tx Hash",
    unsortable: true,
    formatter: (purchase) => {
      const txHash = purchase.id;
      const start = txHash.substring(0, 4);
      const end = txHash.substring(txHash.length - 4);
      return {
        value: `${start}...${end}`,
        subtext: purchase.txUrl,
      };
    },
    Component: (props) => {
      return <Link href={props.subtext}>{props.value}</Link>;
    },
  },
];

export interface TransactionHistoryProps {
  market: CalculatedMarket;
  className?: string;
}

export const TransactionHistory = (props: TransactionHistoryProps) => {
  const network =
    props.market.network === "arbitrum-one" ? "arbitrum" : props.market.network;

  const { data, ...query } = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[network as CHAIN_ID] },
    { marketId: props.market.id }
  );

  const { blockExplorerUrl: blockExplorerTxUrl } = getBlockExplorer(
    props.market.network,
    "tx"
  );
  const { blockExplorerUrl: blockExplorerAddressUrl } = getBlockExplorer(
    props.market.network,
    "address"
  );

  const tableData = data?.bondPurchases
    .map((p) => {
      //@ts-ignore
      p.txUrl = blockExplorerTxUrl + p.id;
      //@ts-ignore (TODO: IMPROVE)
      p.addressUrl = blockExplorerAddressUrl + p.recipient;
      //@ts-ignore (TODO: IMPROVE)
      p.market = props.market;
      return p;
    })
    .filter((p) => p.timestamp > props.market.creationBlockTimestamp) // Avoids fetching markets with the same id from old contracts
    .map((p) => toTableData(marketTxsHistory, p));

  return (
    <div className={props.className}>
      <p className="ml-4 py-4 font-fraktion text-2xl uppercase">
        Transaction History
      </p>
      <Table
        defaultSort="timestamp"
        loading={query.isLoading}
        columns={marketTxsHistory}
        data={tableData}
      />
    </div>
  );
};

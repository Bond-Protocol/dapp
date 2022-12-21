import { format } from "date-fns";
import { CHAIN_ID, getTokenByAddress } from "@bond-protocol/bond-library";
import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useListBondPurchasesPerMarketQuery } from "src/generated/graphql";
import { toTableData } from "src/utils/table";
import { Link, Column, Table } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import {useBondChartData} from "hooks/useBondChartData";
import {useTokens} from "hooks";

const userTxsHistory: Column<any>[] = [
  {
    accessor: "timestamp",
    label: "Time",
    defaultSortOrder: "desc",
    formatter: (purchase) => {
      const timestamp = new Date(purchase.timestamp * 1000);

      const date = format(timestamp, "yyyy.MM.dd");
      const time = format(timestamp, "kk:mm zzz");
      return { sortValue: purchase.timestamp, value: date, subtext: time };
    },
  },
  {
    accessor: "totalValue",
    label: "Total Value",
    alignEnd: true,
    formatter: (purchase) => {
      const value = usdFormatter.format(parseFloat(purchase.payout) * parseFloat(purchase.payoutPrice));
      console.log(value)
      return {
        value: value,
      };
    },
  },
  {
    accessor: "amount",
    label: "Bond Amount",
    alignEnd: true,
    formatter: (purchase) => {
      return {
        value: `${longFormatter.format(purchase.amount)} ${
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
        value: `${longFormatter.format(purchase.payout)} ${
          purchase.payoutToken.symbol
        }`,
      };
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
      return (
        <Link target="_blank" href={props.subtext}>
          {props.value}
        </Link>
      );
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
  const { currentPrices } = useTokens();

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
      p.payoutPrice = currentPrices[p.payoutToken.id]
        //@ts-ignore
        ? currentPrices[p.payoutToken.id][0].price
        : 0;

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

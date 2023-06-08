import { format } from "date-fns";
import {
  CalculatedMarket,
  CHAIN_ID,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { useListBondPurchasesPerMarketQuery } from "src/generated/graphql";
import { toTableData } from "src/utils/table";
import { Column, Link, PaginatedTable } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useTokens } from "hooks";
import { useMemo } from "react";

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
      const value =
        parseFloat(purchase.payout) * parseFloat(purchase.payoutPrice);

      return {
        value:
          purchase.payoutPrice > 0 ? usdFormatter.format(value) : "Unknown",
        sortValue: value,
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
        sortValue: purchase.amount,
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
        sortValue: purchase.payout,
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
        searchValue: address,
      };
    },
    Component: (props) => {
      return (
        <Link target="_blank" rel="noopener noreferrer" href={props.subtext}>
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
        searchValue: txHash,
      };
    },
    Component: (props) => {
      return (
        <Link target="_blank" rel="noopener noreferrer" href={props.subtext}>
          {props.value}
        </Link>
      );
    },
  },
];

export interface TransactionHistoryProps {
  market: CalculatedMarket;
  className?: string;
}

export const TransactionHistory = (props: TransactionHistoryProps) => {
  const { tokens, getByAddress } = useTokens();

  const { data, ...query } = useListBondPurchasesPerMarketQuery(
    {
      // @ts-ignore
      endpoint: subgraphEndpoints[props.market.chainId as CHAIN_ID],
      fetchParams: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
    { marketId: props.market.id }
  );

  const { blockExplorerUrl: blockExplorerTxUrl } = getBlockExplorer(
    props.market.chainId,
    "tx"
  );
  const { blockExplorerUrl: blockExplorerAddressUrl } = getBlockExplorer(
    props.market.chainId,
    "address"
  );

  const tableData = useMemo(
    () =>
      data?.bondPurchases
        .map((p) => {
          const payoutPrice = getByAddress(p.payoutToken.address)?.price ?? 0;

          const txUrl = blockExplorerTxUrl + p.id;
          const addressUrl = blockExplorerAddressUrl + p.recipient;

          return { ...p, payoutPrice, txUrl, addressUrl, market: props.market };
        })
        .filter((p) => p.timestamp > props.market.creationBlockTimestamp) // Avoids fetching markets with the same id from old contracts
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((p) => toTableData(marketTxsHistory, p)),
    [tokens, data]
  );

  return (
    <div className={props.className}>
      <PaginatedTable
        title="Transaction History"
        defaultSort="timestamp"
        loading={query.isLoading}
        columns={marketTxsHistory}
        data={tableData}
      />
    </div>
  );
};

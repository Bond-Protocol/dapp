import { format } from "date-fns";
import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import {
  BondPurchase,
  useListBondPurchasesPerMarketQuery,
} from "src/generated/graphql";
import { Column, Link, PaginatedTable } from "ui";
import { longFormatter, usdFormatter } from "src/utils/format";
import { useTokens } from "hooks";
import { useMemo } from "react";
import { PLACEHOLDER_TOKEN_LOGO_URL } from "src/utils";
import { TweakedBondPurchase } from "services/use-dashboard-loader";

const blockExplorer: Column<TweakedBondPurchase> = {
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
};
const userTxsHistory: Column<TweakedBondPurchase>[] = [
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
    accessor: "amount",
    label: "Bond Amount",
    formatter: (purchase) => {
      return {
        value: `${longFormatter.format(purchase.amount)} ${
          purchase.quoteToken?.symbol ?? "???"
        }`,
        sortValue: purchase.amount,
        icon: purchase.quoteToken?.logoURI ?? PLACEHOLDER_TOKEN_LOGO_URL,
      };
    },
  },

  {
    accessor: "payout",
    label: "Payout Amount",
    formatter: (purchase) => {
      return {
        value: `${longFormatter.format(purchase.payout)} ${
          purchase.payoutToken?.symbol ?? "???"
        }`,
        icon: purchase.payoutToken?.logoURI ?? PLACEHOLDER_TOKEN_LOGO_URL,
        sortValue: purchase.payout,
      };
    },
  },
  {
    accessor: "totalValue",
    label: "Total Value",
    formatter: (purchase) => {
      const value = Number(purchase.payout) * Number(purchase.payoutPrice);

      return {
        value:
          purchase.payoutPrice > 0 ? usdFormatter.format(value) : "Unknown",
        sortValue: value,
      };
    },
  },
  blockExplorer,
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
];

export interface TransactionHistoryProps {
  title?: string;
  market?: CalculatedMarket;
  data?: Array<BondPurchase & { chainId: number | string }>;
  className?: string;
}

export const TransactionHistory = (props: TransactionHistoryProps) => {
  const { tokens, getByAddress } = useTokens();
  const isMarketHistory = !!props.market;
  //@ts-ignore
  const endpoint = subgraphEndpoints[props.market?.chainId];

  const { data, ...query } = useListBondPurchasesPerMarketQuery(
    { endpoint },
    { marketId: props.market?.id },
    { enabled: isMarketHistory }
  );

  const details = (isMarketHistory ? data?.bondPurchases : props.data) ?? [];

  const tableData = useMemo(
    () =>
      details
        .map((p) => {
          //@ts-ignore
          const chainId = isMarketHistory ? props?.market?.chainId : p.chainId;

          const { blockExplorerUrl: blockExplorerTxUrl } = getBlockExplorer(
            chainId,
            "tx"
          );
          const { blockExplorerUrl: blockExplorerAddressUrl } =
            getBlockExplorer(chainId, "address");

          const payoutPrice = getByAddress(p.payoutToken?.address)?.price ?? 0;

          const txUrl = blockExplorerTxUrl + p.id;
          const addressUrl = blockExplorerAddressUrl + p.recipient;

          return { ...p, payoutPrice, txUrl, addressUrl, market: props.market };
        })
        .filter(
          (p) =>
            !isMarketHistory ||
            p.timestamp > props.market?.creationBlockTimestamp!
        ) // Avoids fetching markets with the same id from old contracts
        .sort((a, b) => b.timestamp - a.timestamp),

    [tokens, data, props.data]
  );

  return (
    <div className={props.className}>
      <PaginatedTable
        title={props.title ?? "Transaction History"}
        defaultSort="timestamp"
        loading={query.isLoading}
        columns={isMarketHistory ? marketTxsHistory : userTxsHistory}
        data={tableData}
        //@ts-ignore
        fallback={{
          title: "NO TRANSACTIONS YET",
        }}
      />
    </div>
  );
};

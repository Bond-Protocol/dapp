import { format } from "date-fns";
import {
  CalculatedMarket,
  getBlockExplorer,
  trimAsNumber,
} from "@bond-protocol/contract-library";
import { BondPurchase } from "src/generated/graphql";
import { Column, Link, PaginatedTable } from "ui";
import { longFormatter, usdFullFormatter } from "src/utils/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQueries } from "hooks";
import { PLACEHOLDER_TOKEN_LOGO_URL } from "src/utils";
import axios from "axios";

const blockExplorer: Column<any> = {
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

const baseTxsHistory: Column<any>[] = [
  {
    accessor: "timestamp",
    label: "Time",
    defaultSortOrder: "desc",
    formatter: (purchase) => {
      const timestamp = new Date(Number(purchase.timestamp) * 1000);
      const date = format(timestamp, "yyyy.MM.dd");
      const time = format(timestamp, "kk:mm zzz");
      return {
        sortValue: purchase.timestamp,
        value: date,
        subtext: time,
        csvValues: [timestamp],
      };
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
        subtext: purchase.quoteToken?.price
          ? usdFullFormatter.format(purchase.amountUsd)
          : "Unknown",
        sortValue: purchase.amount,
        csvValues: [purchase.amount, purchase.amountUsd],
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
        subtext: purchase.payoutUsd
          ? usdFullFormatter.format(purchase.payoutUsd)
          : "Unknown",
        icon: purchase.payoutToken?.logoURI ?? PLACEHOLDER_TOKEN_LOGO_URL,
        sortValue: purchase.payout,
        csvValues: [purchase.payout, purchase.payoutUsd],
      };
    },
  },
];

const userTxsHistory: Column<any>[] = [
  ...baseTxsHistory,
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
    accessor: "discount",
    label: "Discount",
    alignEnd: true,
    formatter: (purchase) => {
      let discount =
        (purchase.purchasePriceUsd - purchase.payoutToken?.price!) /
        purchase.payoutToken?.price!;
      discount *= 100;
      discount = trimAsNumber(-discount, 2);

      return {
        value:
          !isNaN(discount) && discount !== Infinity && discount !== -Infinity
            ? discount + "%"
            : "Unknown",
        sortValue: discount,
        csvValues: [discount],
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
        csvValues: [purchase.recipient],
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

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export const TransactionHistory = (props: TransactionHistoryProps) => {
  const { isMobile, isTabletOrMobile } = useMediaQueries();
  const isMarketHistory = !!props.market;

  const [bondPurchases, setBondPurchases] = useState();

  const loadBondPurchases = useCallback(async () => {
    if (!props.market) return;
    const response = await axios.get(
      API_ENDPOINT + `markets/${props.market.id}/bondPurchases`
    );
    return response.data.bondPurchases;
  }, []);

  useEffect(() => {
    loadBondPurchases().then((response) => {
      setBondPurchases(response);
    });
  }, []);

  const details = (isMarketHistory ? bondPurchases : props.data) ?? [];

  const tableData = useMemo(
    () =>
      details
        .map((p) => {
          const chainId = isMarketHistory ? props?.market?.chainId : p.chainId;

          const { blockExplorerUrl: blockExplorerTxUrl } = getBlockExplorer(
            chainId,
            "tx"
          );
          const { blockExplorerUrl: blockExplorerAddressUrl } =
            getBlockExplorer(chainId, "address");

          const txUrl = blockExplorerTxUrl + p.id;
          const addressUrl = blockExplorerAddressUrl + p.recipient;

          return { ...p, txUrl, addressUrl, market: props.market };
        })
        .filter(
          (p) =>
            !isMarketHistory ||
            p.timestamp > props.market?.creationBlockTimestamp!
        ) // Avoids fetching markets with the same id from old contracts
        .sort((a, b) => b.timestamp - a.timestamp),
    [bondPurchases, props.data]
  );
  const desktopColumns = isMarketHistory ? marketTxsHistory : userTxsHistory;
  const cols = isTabletOrMobile ? baseTxsHistory : desktopColumns;

  return (
    <div className={props.className}>
      <PaginatedTable
        hideSearchbar={isTabletOrMobile}
        disableSearch={isTabletOrMobile}
        title={props.title ?? "Transaction History"}
        defaultSort="timestamp"
        columns={cols}
        data={tableData}
        fallback={{ title: "NO TRANSACTIONS YET" }}
        csvHeaders={
          props.market && [
            "TIME",
            `BOND AMOUNT (${props.market?.quoteToken.symbol})`,
            "BOND AMOUNT (USD)",
            `PAYOUT AMOUNT (${props.market?.payoutToken.symbol})`,
            "PAYOUT AMOUNT (USD)",
            "DISCOUNT",
            "ADDRESS",
            "TX HASH",
          ]
        }
      />
    </div>
  );
};

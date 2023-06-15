import { CalculatedMarket } from "@bond-protocol/contract-library";
import { toTableData } from "src/utils/table";
import { Button, Column, formatCurrency, formatDate, PaginatedTable } from "ui";
import { bondColumn, discountColumn } from "./columns";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-left.svg";
import { CloseMarket } from "components";
import { useNavigate } from "react-router-dom";

export const tableColumns: Array<Column<CalculatedMarket>> = [
  bondColumn,
  {
    label: "Payout",
    accessor: "payout",
    formatter: (market) => {
      return {
        value: market.payoutToken.symbol,
        icon: market.payoutToken.logoURI,
      };
    },
  },
  {
    label: "Capacity",
    accessor: "capacity",
    formatter: (market) => {
      const total = formatCurrency.longFormatter.format(
        Number(market.totalPayoutAmount) + Number(market.currentCapacity)
      );
      const remaining = formatCurrency.longFormatter.format(
        market.currentCapacity
      );

      return {
        value: `${remaining} ${market.capacityToken}`,
        subtext: `Total: ${total} ${market.capacityToken}`,
      };
    },
  },
  {
    label: "Assets Received",
    accessor: "assets",
    formatter: (market) => {
      return {
        value:
          formatCurrency.longFormatter.format(market.totalBondedAmount) +
          " " +
          market.quoteToken.symbol,
        subtext: formatCurrency.usdFormatter.format(
          Number(market.formattedTbvUsd)
        ),
      };
    },
  },
  discountColumn,
  {
    label: "End Date",
    accessor: "conclusion",
    formatter: (market) => {
      return {
        value: formatDate.short(new Date(Number(market.conclusion) * 1000)),
      };
    },
  },
  {
    label: "",
    accessor: "",
    //@ts-ignore
    formatter: (market) => {
      return {
        value: market,
      };
    },
    Component: (props) => {
      const navigate = useNavigate();
      const { chainId, marketId } = props.value;
      const goToMarket = () => navigate(`/market/${chainId}/${marketId}`);

      return (
        <div className="flex gap-x-2">
          <CloseMarket market={props.value} />
          <Button thin size="sm" variant="ghost" onClick={() => goToMarket()}>
            <div className="flex place-items-center">
              View
              <ArrowIcon
                height={16}
                width={16}
                className="my-auto rotate-180"
              />
            </div>
          </Button>
        </div>
      );
    },
  },
];

export const UserMarketList = ({ data = [], ...props }: any) => {
  const tableData = data.map((b: any) => toTableData(tableColumns, b));

  return (
    <div className="mt-10">
      <PaginatedTable
        defaultSort="vesting"
        columns={tableColumns}
        data={tableData}
        Fallback={props.Fallback}
      />
    </div>
  );
};

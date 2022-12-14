import { getToken } from "@bond-protocol/bond-library";
import { Button, Table, Column, TableProps } from "ui";
import { formatDate } from "src/utils/date";
import { usdFormatter } from "src/utils/format";

export const tableColumns: Array<Column<any>> = [
  {
    label: "Bond",
    accessor: "asset",
    unsortable: true,
    formatter: (bond) => {
      const asset = getToken(bond?.underlying?.id);
      return {
        value: `${bond?.balance} ${asset?.symbol}`,
        icon: asset?.logoUrl,
      };
    },
  },
  {
    label: "Market Value",
    accessor: "price",
    formatter: (bond) => {
      return {
        value: usdFormatter.format(bond?.usdPrice),
      };
    },
  },
  {
    label: "Vesting",
    accessor: "vesting",
    formatter: (bond) => {
      const expiry = bond?.bond?.bondToken?.expiry;
      const date = new Date(expiry * 1000);
      const formatted = formatDate.short(date);
      const timeLeft = formatDate.distanceToNow(date);

      return {
        value: bond.canClaim ? "Vested" : formatted,
        subtext: bond.canClaim ? `On ${formatted}` : `In ${timeLeft}`,
      };
    },
  },
  {
    label: "",
    accessor: "claim",
    alignEnd: true,
    unsortable: true,
    formatter: (bond) => {
      return {
        onClick: () => bond.handleClaim(),
        data: bond,
      };
    },
    Component: (props: any) => (
      <Button
        thin
        size="sm"
        variant={props?.data?.canClaim ? "primary" : "ghost"}
        disabled={!props?.data?.canClaim}
        className={`mr-4 w-24 ${!props.data?.canClaim && "opacity-60"}`}
        onClick={() => props.onClick()}
      >
        {props?.data?.canClaim ? "Claim" : "Vesting"}
      </Button>
    ),
  },
];

export const BondList = (props) => {
  return (
    <div>
      <Table
        defaultSort="vesting"
        columns={tableColumns}
        data={props.data}
        Fallback={props.Fallback}
      />
    </div>
  );
};

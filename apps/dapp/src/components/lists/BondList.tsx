import { getToken } from "@bond-protocol/bond-library";
import { Button, Table, Column } from "ui";
import { formatDate } from "src/utils/date";
import { formatDistance } from "date-fns";
import { usdFormatter } from "src/utils/format";

export const tableColumns: Array<Column<any>> = [
  {
    label: "Asset",
    accessor: "asset",
    unsortable: true,
    formatter: (bond) => {
      const asset = getToken(bond?.underlying?.id);
      return {
        value: asset?.symbol, //market.quoteToken.symbol + "-" + market.payoutToken.symbol,
        icon: asset?.logoUrl,
      };
    },
  },

  {
    label: "Amount",
    accessor: "usdPrice",
    formatter: (bond) => {
      return {
        value: bond?.balance,
        subtext: usdFormatter.format(bond?.usdPrice),
      };
    },
  },
  {
    label: "Vesting",
    accessor: "vesting",
    formatter: (bond) => {
      const expiry = bond?.bond?.bondToken?.expiry;
      const date = new Date(expiry * 1000);
      const formatted = formatDate(date);
      const timeLeft = formatDistance(Date.now(), date);

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

export const BondList = (props: any) => {
  return (
    <div>
      <Table defaultSort="vesting" columns={tableColumns} data={props.data} />
    </div>
  );
};

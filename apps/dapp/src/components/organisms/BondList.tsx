import { getToken } from "@bond-protocol/bond-library";
import { Button, Table, Column } from "ui";
import { formatDate } from "src/utils/date";
import { formatDistance } from "date-fns";

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
    alignEnd: true,
    formatter: (bond) => {
      const price = bond.usdPrice;
      console.log({ price, bond, balance: bond?.balance }, price);
      return {
        value: bond?.balance,
        subtext: price,
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
      };
    },
    Component: (props: any) => (
      <Button
        thin
        size="sm"
        variant="ghost"
        className="mr-4"
        onClick={() => props.onClick()}
      >
        Claim
      </Button>
    ),
  },
];

export const BondList = (props: any) => {
  return (
    <div>
      <Table columns={tableColumns} data={props.data} />
    </div>
  );
};

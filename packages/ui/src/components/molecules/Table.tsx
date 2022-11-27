import { TableHeading, TableCell, Label, LabelProps, DiscountLabel } from "..";
import logo from "../../assets/icon-logo.png";

const sample: Record<string, LabelProps | string> = {
  bond: {
    icon: logo,
    pairIcon: logo,
    value: "OHM-DAI",
    even: true,
  },
  price: {
    icon: logo,
    value: "$0.0194",
    subtext: "$0.0204 Market",
  },
  discount: { value: "33%" },
  maxPayout: { value: "3,333.33", subtext: "$15,457.48" },
  vesting: { value: "04-20-2577", subtext: "Expiry" },
  creationDate: { value: "04-20-2022" },
  tbv: { value: "33,333,333" },
  issuer: { icon: logo, value: "Bond Protocol" },
};

const sample2: Record<string, LabelProps | string> = {
  bond: {
    icon: logo,
    pairIcon: logo,
    value: "OHM-DAI",
  },
  price: {
    icon: logo,
    value: "$0.0194",
    subtext: "$0.0204 Market",
  },
  discount: { value: "-33%" },
  maxPayout: { value: "3,333.33", subtext: "$15,457.48" },
  vesting: { value: "04-20-2577", subtext: "Expiry" },
  creationDate: { value: "04-20-2022" },
  tbv: { value: "33,333,333" },
  issuer: { icon: logo, value: "Bond Protocol" },
};

const sampels = [sample, sample2, sample];
const cols = [
  { label: "Bond", accessor: "bond" },
  { label: "Bond Price", accessor: "price" },
  {
    label: "Discount",
    accessor: "discount",
    alignEnd: true,
    Component: DiscountLabel,
  },
  { label: "Max Payout", accessor: "maxPayout", alignEnd: true },
  { label: "Vesting", accessor: "vesting" },
  { label: "Creation Date", accessor: "creationDate" },
  { label: "TBV", accessor: "tbv", alignEnd: true },
  { label: "Issuer", accessor: "issuer" },
];

export const Table = () => {
  return (
    <table className="w-full table-fixed">
      <TableHead columns={cols} />
      <TableBody columns={cols} rows={sampels} />
    </table>
  );
};

interface Column {
  label: string;
  accessor: string;
  tooltip?: string;
  alignEnd?: boolean;
  Component?: (props: any) => JSX.Element;
}

export interface TableHeadProps {
  columns: Column[];
}

export const TableHead = (props: TableHeadProps) => {
  return (
    <thead className="">
      <tr className="border-y border-white/25">
        {props.columns.map((field) => (
          <TableHeading key={field.accessor} alignEnd={field.alignEnd}>
            {field.label}
          </TableHeading>
        ))}
      </tr>
    </thead>
  );
};

export interface TableBodyProps {
  rows: any[];
  columns: Column[];
}

export const TableBody = ({ rows, columns }: TableBodyProps) => {
  return (
    <tbody>
      {rows.map((field) => {
        return (
          <tr className="border-white/15 h-20 border-b">
            {columns.map(({ accessor, alignEnd, Component }) => (
              <TableCell alignEnd={alignEnd}>
                {Component ? (
                  <Component {...field[accessor]} />
                ) : (
                  <Label {...field[accessor]} />
                )}
              </TableCell>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

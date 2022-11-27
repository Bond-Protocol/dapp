import { FC } from "react";
import { TableHeading, TableCell } from "..";

export const Table_old: FC<{ children: React.ReactNode }> = (props) => {
  return (
    <table className="w-full table-fixed text-left">{props.children}</table>
  );
};

const sample = {
  bond: "OHM-DAI",
  price: "33.33",
  discount: "33",
  maxPayout: "3,333.33",
  vesting: "04-20-2577",
  creationDate: "04-20-2022",
  tbv: "33,333,333",
};

const sampels = [sample, sample, sample];

export const Table = (props) => {
  const cols = [
    { label: "Bond", accessor: "bond" },
    { label: "Bond Price", accessor: "price" },
    { label: "Discount", accessor: "discount" },
    { label: "Max Payout", accessor: "maxPayout" },
    { label: "Vesting", accessor: "vesting" },
    { label: "Creation Date", accessor: "creationDate" },
    { label: "TBV", accessor: "tbv" },
  ];

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
}

export interface TableHeadProps {
  columns: Column[];
}

export const TableHead = (props: TableHeadProps) => {
  return (
    <thead className="">
      <tr className="">
        {props.columns.map((field) => (
          <TableHeading key={field.accessor}>{field.label}</TableHeading>
        ))}
      </tr>
    </thead>
  );
};

export interface TableBodyProps {
  rows: any[];
  columns: Column[];
}

type Halp = {
  value: string;
  subtext?: string;
  icon?: string;
  pairIcon?: string;
  smallPair?: boolean;
};

export const TableBody = ({ rows, columns }: TableBodyProps) => {
  return (
    <tbody>
      {rows.map((field) => {
        return (
          <tr>
            {columns.map(({ accessor }) => (
              <TableCell>{field[accessor]}</TableCell>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

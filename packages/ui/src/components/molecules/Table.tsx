import { useState } from "react";
import { TableHeading, TableCell, Label, LabelProps } from "..";

export interface Cell extends LabelProps {
  sortValue?: string;
}

export interface Column {
  label: string;
  accessor: string;
  alignEnd?: boolean;
  unsortable?: boolean;
  width?: string;
  Component?: (props: any) => JSX.Element;
}

export interface TableProps {
  columns: Array<Column>;
  data?: Array<Record<string, Cell>>;
}

export const Table = (props: TableProps) => {
  const [data, setData] = useState(props.data || []);

  const handleSorting = (sortField: string, sortOrder: string) => {
    if (sortField) {
      const sorted = [...data].sort((a, b) => {
        const current = a[sortField]?.sortValue || a[sortField].value;
        const next = b[sortField]?.sortValue || b[sortField].value;
        if (!current) return 1;
        if (!next) return -1;
        if (!current && !next) return 0;

        return (
          current.toString().localeCompare(next.toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setData(sorted);
    }
  };

  return (
    <table className="w-full table-fixed">
      {props.columns.map((c) => (
        <col className={c.width && c.width} />
      ))}
      <TableHead columns={props.columns} handleSorting={handleSorting} />
      <TableBody columns={props.columns} rows={data} />
    </table>
  );
};

export interface TableHeadProps {
  columns: Column[];
  handleSorting: (field: string, sortOrder: string) => void;
}

export const TableHead = (props: TableHeadProps) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor: string) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    props.handleSorting(accessor, sortOrder);
  };

  return (
    <thead className="">
      <tr className="child:pl-5 border-y border-white/25 ">
        {props.columns.map((field) => (
          <TableHeading
            isSorting={sortField === field.accessor}
            ascending={order === "asc"}
            key={field.accessor}
            alignEnd={field.alignEnd}
            onClick={
              field.unsortable
                ? undefined
                : () => handleSortingChange(field.accessor)
            }
          >
            {field.label}
          </TableHeading>
        ))}
      </tr>
    </thead>
  );
};

export interface TableBodyProps {
  rows: Array<Record<string, Cell>>;
  columns: Column[];
}

export const TableBody = ({ rows, columns }: TableBodyProps) => {
  return (
    <tbody>
      {rows.map((field) => {
        return (
          <tr className="child:pl-5 border-white/15 h-20 border-b">
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

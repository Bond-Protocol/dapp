import { useState, useEffect } from "react";
import { TableHeading, TableCell, Label, LabelProps } from "..";
import { useSorting } from "hooks";

export interface Cell extends LabelProps {
  sortValue?: string;
}

export interface Column<T> {
  label: string;
  accessor: string;
  alignEnd?: boolean;
  unsortable?: boolean;
  width?: string;
  Component?: (props: any) => JSX.Element;
  formatter?: (element: T) => Cell;
}

export interface TableProps {
  columns: Array<Column<any>>;
  data?: Array<Record<string, Cell>>;
  loading?: boolean;
  defaultSort?: string;
  Fallback?: (props?: any) => JSX.Element;
}

export const Table = (props: TableProps) => {
  const [data, handleSorting] = useSorting(props.data);

  return (
    <table className="w-full table-fixed">
      {props.columns.map((c) => (
        <col className={c.width && c.width} />
      ))}
      <TableHead
        columns={props.columns}
        handleSorting={handleSorting}
        defaultSort={props.defaultSort}
      />
      {props.loading && props.Fallback && <props.Fallback />}
      {!props.loading && <TableBody columns={props.columns} rows={data} />}
    </table>
  );
};

export interface TableHeadProps {
  columns: Column<unknown>[];
  handleSorting: (field: string, sortOrder: string) => void;
  defaultSort?: string;
}

export const TableHead = (props: TableHeadProps) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor: string) => {
    const sortOrder =
      accessor === sortField && order === "desc" ? "asc" : "desc";
    setSortField(accessor);
    setOrder(sortOrder);
    props.handleSorting(accessor, sortOrder);
  };

  useEffect(() => {
    if (props.defaultSort) {
      handleSortingChange(props.defaultSort);
    }
  }, [props.defaultSort]);

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
  columns: Column<unknown>[];
  rows?: Array<Record<string, Cell>>;
}

export const TableBody = ({ rows, columns }: TableBodyProps) => {
  return (
    <tbody>
      {rows?.map((row) => {
        return (
          <tr
            className={`child:pl-5 border-white/15 h-20 border-b hover:cursor-pointer hover:bg-white/5`}
            //@ts-ignore
            onClick={row.onClick}
          >
            {columns.map(({ accessor, alignEnd, Component }) => (
              <TableCell alignEnd={alignEnd}>
                {Component ? (
                  <Component {...row[accessor]} />
                ) : (
                  <Label {...row[accessor]} />
                )}
              </TableCell>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

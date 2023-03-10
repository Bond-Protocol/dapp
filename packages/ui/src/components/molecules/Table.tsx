import { useState, useEffect } from "react";
import { TableHeading, TableCell, Label, LabelProps } from "..";

export type SortOrder = "asc" | "desc";

export interface Cell extends LabelProps {
  sortValue?: string | number;
  searchValue?: string | number;
}

export interface Column<T> {
  label: string;
  accessor: string;
  alignEnd?: boolean;
  unsortable?: boolean;
  width?: string;
  Component?: (props: any) => JSX.Element;
  formatter?: (element: T) => Cell;
  defaultSortOrder?: SortOrder;
}

export interface TableProps {
  columns: Array<Column<any>>;
  data?: Array<Record<string, Cell>>;
  loading?: boolean;
  defaultSort?: string;
  Fallback?: (props?: any) => JSX.Element;
  emptyRows?: number;
  handleSorting: (field: string, sortOrder: string) => void;
}

export const Table = ({ data = [], ...props }: TableProps) => {
  const defaultSortOrder =
    props.columns.find((c) => c.accessor === props.defaultSort && c.defaultSortOrder)?.defaultSortOrder || "desc";

  const handleSorting = props.handleSorting || (() => {});

  return (
    <table className="w-full table-fixed">
      <colgroup>
        {props.columns.map((c, i) => (
          <col key={i} className={c.width && c.width} />
        ))}
      </colgroup>
      <TableHead
        columns={props.columns}
        handleSorting={handleSorting}
        defaultSortField={props.defaultSort}
        defaultSortOrder={defaultSortOrder}
        hasData={!!data}
      />
      {props.loading && props.Fallback && <props.Fallback />}
      {!props.loading && (
        <TableBody
          emptyRows={props.emptyRows}
          columns={props.columns}
          rows={data}
        />
      )}
    </table>
  );
};

export interface TableHeadProps {
  columns: Column<unknown>[];
  handleSorting: (field: string, sortOrder: string) => void;
  defaultSortField?: string;
  defaultSortOrder: SortOrder;
  hasData?: boolean;
}

export const TableHead = (props: TableHeadProps) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor: string) => {
    const issuer = props.columns.find(c => {
      if (c.accessor === accessor)
        return c;
    });

    const sortOrder =
      accessor === sortField
        ? (order === "desc" ? "asc" : "desc") // If the sort field is unchanged, reverse the sort order
        : issuer?.defaultSortOrder || "desc"; // If the sort field has changed, use field default sort order

    setSortField(accessor);
    setOrder(sortOrder);
    props.handleSorting(accessor, sortOrder);
  };

  useEffect(() => {
    if (props.defaultSortField && props.hasData) {
      props.handleSorting(props.defaultSortField, props.defaultSortOrder);
      setOrder(props.defaultSortOrder);
      setSortField(props.defaultSortField);
    }
  }, [props.defaultSortField, props.hasData]);

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
  emptyRows?: number;
}

export const TableBody = ({ columns, rows, emptyRows }: TableBodyProps) => {
  return (
    <tbody className="w-full">
      {rows?.map((row, i) => {
        return (
          <tr
            key={i}
            className={`child:pl-5 border-white/15 h-20 border-b ${
              row.onClick &&
              "transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-white/5"
            }`}
            //@ts-ignore
            onClick={row.onClick}
          >
            {columns.map(({ accessor, alignEnd, Component }) => (
              <TableCell key={accessor} alignEnd={alignEnd}>
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

      {emptyRows ? (
        // Avoid a layout jump when reaching the last page with empty rows.
        <tr style={{ height: 80 * emptyRows }}>
          <TableCell colSpan={columns.length} />
        </tr>
      ) : (
        <tr />
      )}
    </tbody>
  );
};

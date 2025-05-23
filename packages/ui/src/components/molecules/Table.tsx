import { useState, useEffect } from "react";
import { TableHeading, TableCell, Label, LabelProps } from "..";

export type SortOrder = "asc" | "desc";

export interface Cell extends LabelProps {
  sortValue?: string | number;
  searchValue?: string | number;
  data?: any;
}

export interface Column<T> {
  label: string;
  accessor: string;
  alignEnd?: boolean;
  unsortable?: boolean;
  width?: string;
  tooltip?: string;
  Component?: (props: any) => JSX.Element;
  formatter?: (element: T) => Cell;
  defaultSortOrder?: SortOrder;
}

export interface TableProps {
  columns: Array<Column<any>>;
  data?: Array<any>;
  loading?: boolean;
  defaultSort?: string;
  //fallback?: React.ReactNode;
  emptyFallback?: string;
  emptyRows?: number;
  className?: string;
  headClassName?: string;
  bodyClassName?: string;
  handleSorting?: (field: string, sortOrder: string) => void;
}

export const Table = ({ data = [], ...props }: TableProps) => {
  const defaultSortOrder =
    props.columns.find(
      (c) => c.accessor === props.defaultSort && c.defaultSortOrder
    )?.defaultSortOrder || "desc";

  const handleSorting = props.handleSorting || (() => {});

  return (
    <>
      <table className={"w-full table-fixed" + " " + props.className}>
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
          className={props.headClassName}
        />
        {!props.loading && (
          <TableBody
            className={props.bodyClassName}
            emptyRows={props.emptyRows}
            columns={props.columns}
            rows={data}
          />
        )}
      </table>
    </>
  );
};

export interface TableHeadProps {
  columns: Column<unknown>[];
  handleSorting: (field: string, sortOrder: string) => void;
  defaultSortField?: string;
  defaultSortOrder: SortOrder;
  hasData?: boolean;
  className?: string;
}

export const TableHead = (props: TableHeadProps) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor: string) => {
    const issuer = props.columns?.find((c) => {
      if (c.accessor === accessor) return c;
    });

    const sortOrder =
      accessor === sortField
        ? order === "desc"
          ? "asc"
          : "desc" // If the sort field is unchanged, reverse the sort order
        : issuer?.defaultSortOrder || "desc"; // If the sort field has changed, use field default sort order

    setSortField(accessor);
    setOrder(sortOrder);
    props.handleSorting(accessor, sortOrder);
  };

  useEffect(() => {
    if (props.defaultSortField && props.hasData) {
      handleSortingChange(props.defaultSortField);
    }
  }, [props.defaultSortField, props.hasData]);

  return (
    <thead className={"border-y border-white/25 " + (props.className ?? "")}>
      <tr className="child:pl-5 ">
        {props.columns.map((field) => (
          <TableHeading
            isSorting={sortField === field.accessor}
            ascending={order === "asc"}
            //@ts-ignore
            tooltip={field.tooltip}
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
  className?: string;
}

export const TableBody = ({
  columns,
  rows,
  emptyRows,
  className,
}: TableBodyProps) => {
  return (
    <tbody className={"w-full" + " " + className}>
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

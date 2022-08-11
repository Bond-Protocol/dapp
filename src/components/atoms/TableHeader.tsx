import { useState } from "react";
import { TableCell, TableCellProps } from "./TableCell";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon";

export type TableHeaderProps = TableCellProps;

export const TableHeader = (props: TableCellProps) => {
  const [sorting, setSorting] = useState(false);
  const [ascending, setAscending] = useState(false);

  return (
    <TableCell
      {...props}
      className={`${props.onClick && "cursor-pointer"}`}
      onClick={(e) => {
        if (!props.onClick) return;
        if (sorting) setAscending((a) => !a);

        setSorting(true);
        props.onClick(e);
      }}
      icon={
        <ArrowDownIcon
          width="16"
          className={`${ascending ? "rotate-180" : ""} ${
            sorting ? "opacity-100" : "opacity-0"
          } mt-[1px] transition-all ease-in-out fill-white`}
        />
      }
    />
  );
};

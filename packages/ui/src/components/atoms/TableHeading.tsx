import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { TableCell, TableCellProps } from "./TableCell";
import TooltipIcon from "../../assets/icons/tooltip-icon";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon";

export type TableHeadingProps = TableCellProps & {
  tooltip?: string;
  onClickIcon?: () => void;
  sortName?: string;
  ascending?: boolean;
  isSorting?: boolean;
  marketSort?: string;
  setMarketSort?: (value: string) => void;
};

export const TableHeading = ({
  marketSort,
  setMarketSort,
  isSorting,
  ...props
}: TableHeadingProps) => {
  return (
    <TableCell
      {...props}
      heading
      className={`${
        props.onClick && "cursor-pointer"
      } w-2 select-none pb-2 pt-1.5 leading-none tracking-wide ${
        props.className
      }`}
    >
      {isSorting && (
        <div
          className="my-auto mr-1 cursor-pointer "
          onClick={props.onClickIcon}
        >
          <ArrowDownIcon
            width="16"
            className={`${props.ascending ? "rotate-180" : ""} ${
              isSorting ? "opacity-100" : "opacity-0"
            } mt-[1px] fill-white`}
          />
        </div>
      )}
      {props.children}
      {props.tooltip && (
        <Tooltip content={props.tooltip}>
          <div className="ml-0.5 cursor-help">
            <TooltipIcon className="fill-white" width="16" />
          </div>
        </Tooltip>
      )}
    </TableCell>
  );
};

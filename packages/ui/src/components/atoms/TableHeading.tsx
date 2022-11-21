import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { TableCell, TableCellProps } from "./TableCell";
import TooltipIcon from "../../assets/icons/tooltip-icon";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon";

export type TableHeadingProps = TableCellProps & {
  tooltip?: string;
  onClickIcon?: () => void;
  alignEnd?: boolean;
  sortName?: string;
  ascending?: boolean;
  marketSort?: string;
  setMarketSort?: (value: string) => void;
};

export const TableHeading = ({
  marketSort,
  setMarketSort,
  ...props
}: TableHeadingProps) => {
  const [sorting, setSorting] = useState(false);
  const isSorting =
    sorting &&
    marketSort &&
    props.sortName &&
    marketSort.localeCompare(props.sortName) === 0;

  return (
    <TableCell
      {...props}
      heading
      className={`${
        props.onClick && "cursor-pointer"
      } w-2 pb-4 text-left text-base ${props.className}`}
      onClick={(e) => {
        if (!props.onClick) return;

        setSorting(true);
        setMarketSort && setMarketSort(props.sortName ? props.sortName : "");
        props.onClick(e);
      }}
    >
      <div
        className={`font-faketion flex tracking-widest ${
          props.alignEnd ? "justify-end" : "justify-start"
        }`}
      >
        {isSorting && (
          <div
            className="my-auto mr-1 cursor-pointer"
            onClick={props.onClickIcon}
          >
            <ArrowDownIcon
              width="16"
              className={`${props.ascending ? "rotate-180" : ""} ${
                sorting ? "opacity-100" : "opacity-0"
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
      </div>
    </TableCell>
  );
};

import { TableCell, TableCellProps } from "./TableCell";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-down-icon.svg";

import { Tooltip } from "./Tooltip";

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
  ascending,
  ...props
}: TableHeadingProps) => {
  return (
    <TableCell
      {...props}
      heading
      className={`${
        props.onClick && "cursor-pointer"
      } w-2 select-none bg-white/5 py-1 pb-1 leading-none tracking-wide ${
        props.className
      }`}
    >
      {!props.alignEnd && props.tooltip && (
        <Tooltip iconClassname="fill-white mr-0.5" content={props.tooltip} />
      )}
      {isSorting && props.alignEnd && (
        <div
          className="my-auto mr-1 cursor-pointer "
          onClick={props.onClickIcon}
        >
          <ArrowDownIcon
            width="16"
            className={`${ascending ? "rotate-180" : ""} ${
              isSorting ? "opacity-100" : "opacity-0"
            } fill-white`}
          />
        </div>
      )}
      {props.children}
      {isSorting && !props.alignEnd && (
        <div
          className="my-auto mr-1 cursor-pointer "
          onClick={props.onClickIcon}
        >
          <ArrowDownIcon
            width="16"
            className={`${ascending ? "rotate-180" : ""} ${
              isSorting ? "opacity-100" : "opacity-0"
            } fill-white`}
          />
        </div>
      )}
      {props.alignEnd && props.tooltip && (
        <Tooltip iconClassname="fill-white" content={props.tooltip} />
      )}
    </TableCell>
  );
};

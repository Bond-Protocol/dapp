import {useState} from "react";
import {Tooltip} from "@material-tailwind/react";
import {TableCell, TableCellProps} from "./TableCell";
import TooltipIcon from "../../assets/icons/tooltip-icon";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon";

export type TableHeadingProps = TableCellProps & {
  tooltip?: string;
  onClickIcon?: () => void;
  alignEnd?: boolean;
};

export const TableHeading = (props: TableHeadingProps) => {
  const [sorting, setSorting] = useState(false);
  const [ascending, setAscending] = useState(false);

  return (
    <TableCell
      {...props}
      heading
      className={`${props.onClick && "cursor-pointer"} w-2 text-left ${
        props.className
      }`}
      onClick={(e) => {
        if (!props.onClick) return;
        if (sorting) setAscending((a) => !a);

        setSorting(true);
        props.onClick(e);
      }}
    >
      <div
        className={`flex font-fraktion tracking-widest ${
          props.alignEnd ? "justify-end" : "justify-start"
        }`}
      >
        {sorting && (
          <div
            className="mr-1 my-auto cursor-pointer"
            onClick={props.onClickIcon}
          >
            <ArrowDownIcon
              width="16"
              className={`${ascending ? "rotate-180" : ""} ${
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

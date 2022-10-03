import {useState} from "react";
import {Tooltip} from "@material-tailwind/react";
import {TableCell, TableCellProps} from "./TableCell";
import TooltipIcon from "../../assets/icons/tooltip-icon";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon";
import {useAtom} from "jotai";
import marketListSort from "../../atoms/marketListSort.atom";

export type TableHeadingProps = TableCellProps & {
  tooltip?: string;
  onClickIcon?: () => void;
  alignEnd?: boolean;
  sortName?: string;
  ascending?: boolean;
};

export const TableHeading = (props: TableHeadingProps) => {
  const [sorting, setSorting] = useState(false);
  const [marketSort, setMarketSort] = useAtom(marketListSort);

  return (
    <TableCell
      {...props}
      heading
      className={`${props.onClick && "cursor-pointer"} w-2 text-left ${
        props.className
      }`}
      onClick={(e) => {
        if (!props.onClick) return;

        setSorting(true);
        setMarketSort(props.sortName ? props.sortName : "");
        props.onClick(e);
      }}
    >
      <div
        className={`flex font-faketion tracking-widest ${
          props.alignEnd ? "justify-end" : "justify-start"
        }`}
      >
        {sorting && marketSort && props.sortName && marketSort.localeCompare(props.sortName) === 0 && (
          <div
            className="mr-1 my-auto cursor-pointer"
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

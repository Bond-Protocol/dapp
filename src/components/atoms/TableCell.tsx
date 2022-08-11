import { Tooltip } from "@material-tailwind/react";
import TooltipIcon from "../../assets/icons/tooltip-icon";
import { forwardRef } from "react";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  tooltip?: string;
  icon?: React.ReactNode;
  onClickIcon?: () => void;
};

export const TableCell = forwardRef(function TableCell(
  props: TableCellProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  return (
    <td
      {...props}
      ref={ref}
      className={`flex justify-around ${props.className}`}
    >
      <div className="mr-1 my-auto cursor-pointer" onClick={props.onClickIcon}>
        {props.icon}
      </div>
      {props.children}
      {props.tooltip && (
        <Tooltip content={props.tooltip}>
          <div className="cursor-help">
            <TooltipIcon className="fill-white" width="16" />
          </div>
        </Tooltip>
      )}
    </td>
  );
});

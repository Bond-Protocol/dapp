import { forwardRef } from "react";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  heading?: boolean;
};

export const TableCell = forwardRef(function TableCell(
  { heading, ...props }: TableCellProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  const CellType = heading ? "th" : "td";
  const border = heading ? "" : "border-gray-700";

  return (
    <CellType
      {...props}
      ref={ref}
      className={`font-jakarta font-light text-[15px] ${border} ${props.className}`}
    >
      {props.children}
    </CellType>
  );
});

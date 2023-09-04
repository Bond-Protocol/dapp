import { forwardRef } from "react";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  heading?: boolean;
  alignEnd?: boolean;
};

export const TableCell = forwardRef(function TableCell(
  { heading, alignEnd, ...props }: TableCellProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  const CellType = heading ? "th" : "td";
  const style = heading
    ? "font-fraktion uppercase border-light-grey-500"
    : "border-gray-700";

  return (
    <CellType
      {...props}
      ref={ref}
      className={`${style} ${props.className} ${alignEnd ? "text-right" : ""}`}
    >
      <div className={`flex px-1 ${alignEnd && "justify-end"}`}>
        {props.children}
      </div>
    </CellType>
  );
});

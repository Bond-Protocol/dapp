import { forwardRef } from "react";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  heading?: boolean;
  alignEnd?: boolean;
};

export const TableCell = forwardRef(function TableCell(
  { heading, ...props }: TableCellProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  const CellType = heading ? "th" : "td";
  const style = heading ? "font-fraktion uppercase" : "border-gray-700";

  return (
    <CellType
      {...props}
      ref={ref}
      className={`${style} ${props.className} ${
        props.alignEnd ? "text-right" : ""
      }`}
    >
      <div className={`flex ${props.alignEnd && "justify-end pr-10"}`}>
        {props.children}
      </div>
    </CellType>
  );
});

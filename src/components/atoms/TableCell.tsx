import { forwardRef } from "react";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  heading?: boolean;
};

export const TableCell = forwardRef(function TableCell(
  props: TableCellProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  const CellType = props.heading ? "th" : "td";

  return (
    <CellType {...props} ref={ref} className={`${props.className}`}>
      {props.children}
    </CellType>
  );
});

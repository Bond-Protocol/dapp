import { useState, forwardRef } from "react";
import TablePaginationUnstyled, {
  TablePaginationUnstyledProps,
} from "@mui/base/TablePaginationUnstyled";

export type TablePaginationProps = TablePaginationUnstyledProps & {
  length?: number;
};

export const TablePagination = forwardRef(function TablePagination(
  props: TablePaginationProps,
  ref: React.ForwardedRef<HTMLTableCellElement>
) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(props);
  return (
    <TablePaginationUnstyled
      {...props}
      rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      count={length}
      rowsPerPage={rowsPerPage}
      page={page}
      ref={ref}
    />
  );
});

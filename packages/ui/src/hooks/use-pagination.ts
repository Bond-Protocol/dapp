import { useState } from "react";

export type UsePaginationProps = {
  data: any[];
};

/** Utility hook to handle array pagination */
export const usePagination = <T>(data: T[]) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const toggleAll = () => {
    setRowsPerPage(rowsPerPage === -1 ? 10 : -1);
    setPage(0);
  };

  const totalRows = data?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(rowsPerPage));

  //Used to make pages consistent by having the same number of rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRows) : 0;

  const rows =
    rowsPerPage > 0
      ? data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return {
    rows,
    page,
    emptyRows,
    rowsPerPage,
    totalPages,
    totalRows,
    handleChangePage,
    toggleAll,
  };
};

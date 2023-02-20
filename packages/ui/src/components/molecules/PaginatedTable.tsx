import { useMemo, useState } from "react";
import { Table, TableProps } from "./Table";
import { useSorting } from "hooks/use-sorting";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";

export type PaginatedTableProps = Omit<TableProps, "handleSorting"> & {
  title?: string;
  className?: string;
};

export const PaginatedTable = (props: PaginatedTableProps) => {
  const [data, handleSorting] = useSorting(props.data);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const toggleAll = () => {
    setRowsPerPage(rowsPerPage === -1 ? 10 : -1);
    setPage(0);
  };

  const filteredData = useMemo(
    () =>
      data?.filter((r) =>
        Object.values(r).some((v) =>
          String(v?.value).toLowerCase().includes(text.toLowerCase())
        )
      ),
    [text, data]
  );

  const totalRows = filteredData?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(rowsPerPage));

  const rows =
    rowsPerPage > 0
      ? filteredData?.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : filteredData;

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - totalRows);

  return (
    <div className={props.className}>
      <div className="flex items-center justify-between pb-4">
        {props.title && (
          <p className="font-fraktion ml-4 text-2xl uppercase">{props.title}</p>
        )}
        <SearchBar handleChange={setText} className="max-w-xs" />
      </div>
      <Table
        {...props}
        handleSorting={handleSorting}
        emptyRows={emptyRows}
        data={rows}
      />
      {totalRows > rowsPerPage && (
        <Pagination
          className="mt-4"
          handleChangePage={handleChangePage}
          selectedPage={page}
          totalPages={totalPages}
          onSeeAll={toggleAll}
          isShowingAll={rowsPerPage === -1}
        />
      )}
    </div>
  );
};

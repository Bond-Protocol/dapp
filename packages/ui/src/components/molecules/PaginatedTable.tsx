import { useMemo, useState } from "react";
import { Table, TableProps } from "./Table";
import { useSorting } from "hooks/use-sorting";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";

export type PaginatedTableProps = Omit<TableProps, "handleSorting"> & {
  title?: string | JSX.Element;
  filterText?: string;
  hideSearchbar?: boolean;
  className?: string;
  headingClassName?: string;
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

  const filteredData = useMemo(() => {
    const textToFilter = props.filterText ?? text;

    return data?.filter((r) =>
      Object.values(r).some((v) => {
        const value = v?.searchValue || v?.value;

        return String(value).toLowerCase().includes(textToFilter.toLowerCase());
      })
    );
  }, [text, props.filterText, data]);

  const totalRows = filteredData?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(rowsPerPage));

  const rows =
    rowsPerPage > 0
      ? filteredData?.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : filteredData;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRows) : 0;

  return (
    <div className={props.className}>
      <div
        className={`flex items-center justify-between ${props.headingClassName}`}
      >
        {props.title && (
          <p className="font-fraktion ml-4 text-2xl uppercase">{props.title}</p>
        )}
        {!props.hideSearchbar && (
          <SearchBar
            value={text}
            onChange={setText}
            className="mb-2 max-w-xs justify-self-end"
          />
        )}
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

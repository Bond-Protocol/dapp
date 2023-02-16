import { ReactComponent as CaretDown } from "../../assets/icons/select-arrow-down.svg";
import { useState } from "react";
import { Table, TableProps } from "./Table";
import { Icon } from "..";
import { useSorting } from "hooks/use-sorting";

export const PaginatedTable = (props: Omit<TableProps, "footer">) => {
  const [data, handleSorting] = useSorting(props.data);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const toggleAll = () => {
    setRowsPerPage(rowsPerPage === -1 ? 10 : -1);
    setPage(0);
  };

  const totalRows = props.data?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(rowsPerPage));

  const rows =
    rowsPerPage > 0
      ? data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRows) : 0;

  return (
    <div>
      <Table
        {...props}
        handleSorting={handleSorting}
        emptyRows={emptyRows}
        data={rows}
      />
      <TablePagination
        handleChangePage={handleChangePage}
        currentPage={page}
        totalPages={totalPages}
        onSeeAll={toggleAll}
        isShowingAll={rowsPerPage === -1}
      />
    </div>
  );
};

export const PaginationSelector = (props: {
  value: number;
  currentPage: number;
  onClickPage: (num: number) => void;
  className?: string;
}) => {
  const isSelected = props.value === props.currentPage;
  const selectedStyle =
    "border-light-secondary text-light-secondary rounded-lg border";

  const handleClick = () => props.onClickPage(props.value);

  return (
    <div
      onClick={handleClick}
      className={`flex h-8 w-8 max-w-[32px] cursor-pointer select-none items-center justify-center p-1 text-center text-[14px] hover:rounded-lg hover:border ${
        isSelected && selectedStyle
      } ${props.className} `}
    >
      {props.value + 1}
    </div>
  );
};

export const TablePagination = ({
  totalPages,
  currentPage,
  handleChangePage,
  onSeeAll,
  isShowingAll,
}: {
  totalPages: number;
  currentPage: number;
  handleChangePage: (page: number) => void;
  onSeeAll: (e: React.BaseSyntheticEvent) => void;
  isShowingAll?: boolean;
}) => {
  const elements = Array(totalPages)
    .fill(null)
    .map((_e, i) => {
      const thisPage = i;

      const showCurrentSelector = (() => {
        if (currentPage <= 3 && thisPage <= 4) {
          return true;
        }

        if (currentPage >= totalPages - 4 && thisPage >= totalPages - 5) {
          return true;
        }

        return (
          thisPage === 0 ||
          thisPage === currentPage - 1 ||
          thisPage === currentPage ||
          thisPage === currentPage + 1 ||
          thisPage === totalPages - 1
        );
      })();

      const showAsSeparator = (() => {
        if (currentPage <= 2 && thisPage === 5) return true;
        if (currentPage >= totalPages - 3 && thisPage === totalPages - 6)
          return true;

        if (showCurrentSelector) return false;

        return thisPage === currentPage - 2 || thisPage === currentPage + 2;
      })();

      if (showAsSeparator && totalPages > 7) {
        return <div className={"mx-[10px] w-[12px] border-b border-dashed"} />;
      }

      return (
        <PaginationSelector
          key={thisPage}
          value={thisPage}
          currentPage={currentPage}
          onClickPage={handleChangePage}
          className={!showCurrentSelector && totalPages > 7 ? "hidden" : ""}
        />
      );
    });

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="mt-2 w-full">
      {!isShowingAll && (
        <div className="flex justify-center gap-x-0.5">
          <Icon
            className={
              !isFirstPage
                ? "cursor-pointer rounded-lg hover:border"
                : "text-white/30"
            }
            onClick={() => !isFirstPage && handleChangePage(currentPage - 1)}
          >
            {<CaretDown className="rotate-90" />}
          </Icon>
          {elements}
          <Icon
            className={
              !isLastPage
                ? "cursor-pointer rounded-lg hover:border"
                : "text-white/30"
            }
            onClick={() => !isLastPage && handleChangePage(currentPage + 1)}
          >
            <CaretDown className="-rotate-90" />
          </Icon>
        </div>
      )}
      <div
        className="mt-1 cursor-pointer select-none text-center font-mono text-[14px] uppercase hover:underline"
        onClick={onSeeAll}
      >
        {isShowingAll ? "See Less" : "See All"}
      </div>
    </div>
  );
};

import { ReactComponent as CaretDown } from "../../assets/icons/select-arrow-down.svg";
import { useState } from "react";
import { TablePaginationUnstyled } from "@mui/base";
import { Table, TableProps } from "./Table";
import { Icon } from "..";

export const PaginatedTable = (props: Omit<TableProps, "footer">) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - props.data?.length || 0)
      : 0;

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

  const _data =
    rowsPerPage > 0
      ? props.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : props.data;

  return (
    <div>
      <Table {...props} data={_data} />
      <TablePaginationCool
        handleChangePage={handleChangePage}
        currentPage={page}
        totalPages={15}
      />
    </div>
  );
};

const Separator = () => (
  <div className={"mx-[10px] w-[12px] border-b border-dashed"} />
);

export const PaginationSelector = (props: {
  value: number;
  currentPage: number;
  onClickPage: (e: React.BaseSyntheticEvent, num: number) => void;
  showSeparator?: boolean;
  className?: string;
}) => {
  const isSelected = props.value === props.currentPage;
  const selectedStyle =
    "border-light-secondary text-light-secondary rounded-lg border";

  const handleClick = (e: React.BaseSyntheticEvent) =>
    props.onClickPage(e, props.value);

  if (props.showSeparator) return <Separator />;

  return (
    <div
      onClick={handleClick}
      className={`flex h-8 w-8 max-w-[32px] cursor-pointer select-none items-center justify-center p-1 text-center text-[14px] ${
        isSelected && selectedStyle
      } ${props.className} hover:rounded-lg hover:border`}
    >
      {props.value}
    </div>
  );
};

const TablePaginationCool = ({
  count,
  totalPages,
  currentPage,
  handleChangePage,
}: {
  count: number;
  totalPages: number;
  currentPage: number;
  handleChangePage: (e: React.BaseSyntheticEvent, page: number) => void;
}) => {
  const elements = Array(totalPages)
    .fill({})
    .map((x, i) => {
      const thisPage = i + 1;
      const showShow =
        thisPage === 1 ||
        thisPage === currentPage - 1 ||
        thisPage === currentPage ||
        thisPage === currentPage + 1 ||
        thisPage === totalPages;

      const initialEdgeCase = (() => {
        if (currentPage <= 3) {
          if (thisPage <= 6) return true;
        }
        if (currentPage >= totalPages - 3 && thisPage >= totalPages - 4) {
          return true;
        }
      })();

      const showSeparator = (function () {
        if (currentPage <= 4 && thisPage === 6) return true;
        if (currentPage >= totalPages - 2 && thisPage === totalPages - 5)
          return true;

        if (initialEdgeCase) return false;

        return thisPage === currentPage - 2 || thisPage === currentPage + 2;
      })();

      return (
        <PaginationSelector
          key={i}
          value={i + 1}
          className={!showShow && !initialEdgeCase ? "hidden" : ""}
          currentPage={currentPage}
          showSeparator={showSeparator}
          onClickPage={handleChangePage}
        />
      );
    });

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-2 flex w-full justify-center gap-x-0.5">
      <Icon
        className={"rounded-lg hover:border"}
        onClick={(e: any) => {
          if (!isFirstPage) {
            handleChangePage(e, currentPage - 1);
          }
        }}
      >
        <CaretDown className="rotate-90" />
      </Icon>
      {elements}
      <Icon
        className="rounded-lg hover:border"
        onClick={(e: any) => {
          if (!isLastPage) {
            handleChangePage(e, currentPage + 1);
          }
        }}
      >
        <CaretDown className="-rotate-90" />
      </Icon>
    </div>
  );
};

import React, { useMemo, useState } from "react";
import { Cell, Column, Table, TableProps } from "./Table";
import { useSorting } from "hooks/use-sorting";
import { Button, Filter, FilterBox, Loading } from "components";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { usePagination } from "src/hooks/use-pagination";

export const toValue = (value: any) => ({ value });
export const toTableData = (
  columns: Column<any>[],
  data: any
): Record<string, Cell | Function> => {
  return columns.reduce((acc, { accessor, formatter }) => {
    const value = String(data[accessor]);
    return {
      ...acc,
      [accessor]: formatter ? { data, ...formatter(data) } : toValue(value),
    };
  }, {});
};

export interface FallbackProps {
  title?: string;
  subtext?: string;
  buttonText?: string;
  onClick?: () => void;
}

const Fallback = (props: FallbackProps) => {
  return (
    <div className="mt-20 flex w-full flex-col place-items-center text-center">
      <div className="text-3xl">{props.title}</div>
      <div className="my-4">{props.subtext}</div>
      {props.buttonText && (
        <Button onClick={props.onClick}>{props.buttonText}</Button>
      )}
    </div>
  );
};

const filterTable = (element: Cell, filter: string) =>
  Object.values(element).some((v) => {
    const value = v?.searchValue || v?.value;

    return String(value).toLowerCase().includes(filter.toLowerCase());
  });

export type PaginatedTableProps = Omit<TableProps, "handleSorting"> & {
  title?: string | JSX.Element;
  filterText?: string;
  hideSearchbar?: boolean;
  className?: string;
  headingClassName?: string;
  fallback?: FallbackProps;
  filters?: Filter[];
  onClickRow?: (args: any) => void;
};

export const PaginatedTable = ({
  filters = [],
  ...props
}: PaginatedTableProps) => {
  const [textToFilter, setTextToFilter] = useState(props.filterText ?? "");

  const mappedFilters = filters.map((f) =>
    f.type === "search"
      ? { ...f, handler: (v: string) => setTextToFilter(v) }
      : f
  );

  const [activeFilters, setActiveFilters] = useState<Filter[]>(
    mappedFilters.filter((f) => f.startActive)
  );

  const tableData = useMemo(
    () =>
      props.data
        ?.filter((d) =>
          activeFilters?.every((f) => f.type === "search" || f.handler(d))
        )
        ?.map((d) => {
          const row = toTableData(props.columns, d);
          if (props.onClickRow) {
            row.onClick = () => props.onClickRow?.(d);
          }
          return row;
        }),

    [props.data, props.columns, activeFilters.length]
  );

  const [data, handleSorting] = useSorting(tableData);

  const onClickFilter = (id: string) => {
    const filter = filters.find((f) => f.id === id)!;
    const activeFilter = activeFilters.find((f) => f.id === id);

    if (activeFilter) {
      setActiveFilters(activeFilters.filter((f) => f.id !== id));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filteredData = data?.filter((element) =>
    filterTable(element, textToFilter)
  );

  const {
    page,
    rows,
    emptyRows,
    rowsPerPage,
    totalPages,
    totalRows,
    handleChangePage,
    toggleAll,
  } = usePagination(filteredData);

  const isLoading = props.loading;
  const isEmpty =
    !props.loading && !filteredData?.length && activeFilters.length === 0;

  return (
    <div className={"pb-20 " + props.className}>
      <div
        className={`flex items-center justify-between ${props.headingClassName}`}
      >
        <div>
          {props.title && (
            <p className="font-fraktion ml-4 text-2xl font-bold uppercase">
              {props.title}
            </p>
          )}
        </div>

        <div className="mb-2 flex h-min gap-x-1">
          {!props.hideSearchbar && (
            <SearchBar
              value={textToFilter}
              onChange={setTextToFilter}
              className={"max-w-xs justify-self-end"}
            />
          )}

          {!!filters.length && (
            <FilterBox
              handleFilterClick={onClickFilter}
              activeFilters={activeFilters}
              filters={filters}
            />
          )}
        </div>
      </div>
      <Table
        {...props}
        handleSorting={handleSorting}
        emptyRows={emptyRows}
        data={rows}
      />

      {isLoading && (
        <div className={props.className}>
          <Loading />
        </div>
      )}

      {isEmpty && (
        <div className={"pb-8" + props.className}>
          {React.isValidElement(props.fallback) ? (
            props.fallback
          ) : (
            <Fallback {...(props.fallback as FallbackProps)} />
          )}
        </div>
      )}

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

import { CSVLink } from "react-csv";
import React, { useMemo, useState } from "react";
import { Cell, Column, Table, TableProps } from "./Table";
import { useSorting } from "../../hooks/use-sorting";
import { Button, Filter, FilterBox, Loading, Tooltip } from "..";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { usePagination } from "../../hooks/use-pagination";
import DownloadIcon from "../../assets/icons/download.svg?react";

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

const filterRowByText = (element: Cell, filter: string) =>
  Object.values(element).some((v) => {
    const value = v?.searchValue || v?.value;

    return String(value).toLowerCase().includes(filter.toLowerCase());
  });

export type PaginatedTableProps = Omit<TableProps, "handleSorting"> & {
  title?: string | JSX.Element;
  filterText?: string;
  hideSearchbar?: boolean;
  disableSearch?: boolean;
  className?: string;
  headingClassName?: string;
  csvHeaders?: string[];
  csvFilename?: string;
  fallback?: FallbackProps;
  filters?: Filter[];
  globalFilters?: Filter[];
  onClickRow?: (args: any) => void;
};

const SEARCH_FILTER = {
  type: "search",
  id: "search",
  label: "Search",
  startActive: false,
} as Filter;

export const PaginatedTable = ({
  filters = [],
  ...props
}: PaginatedTableProps) => {
  const [textToFilter, setTextToFilter] = useState(props.filterText ?? "");

  const searchFilter = {
    ...SEARCH_FILTER,
    handler: (value: string) => {
      setTextToFilter(value);
      setActiveFilters(
        !!value
          ? (prev) => [...prev, SEARCH_FILTER]
          : activeFilters.filter((f) => f.id !== SEARCH_FILTER.id)
      );
    },
  };

  const mappedFilters: Filter[] =
    !props.hideSearchbar && !props.disableSearch
      ? [searchFilter, ...filters]
      : filters;

  const [activeFilters, setActiveFilters] = useState<Filter[]>(
    mappedFilters.filter((f) => f.startActive)
  );

  const tableData = useMemo(
    () =>
      props.data
        ?.filter((c) => {
          return activeFilters?.every((f) => {
            return f.type === "search" || f.type === "global" || f.handler(c);
          });
        })
        ?.map((d) => {
          const row = toTableData(props.columns, d);
          if (props.onClickRow) {
            row.onClick = () => props.onClickRow?.(d);
          }
          return row;
        })

        ?.filter((cell) =>
          activeFilters?.every(
            (f) =>
              (f.type !== "search" && f.type === "global") ||
              filterRowByText(cell, textToFilter)
          )
        ),

    [props.data, props.columns, activeFilters.length, textToFilter]
  );

  const onClickFilter = (id: string) => {
    const filter = mappedFilters.find((f) => f.id === id)!;
    const activeFilter = activeFilters.find((f) => f.id === id);

    if (filter.type === "global") {
      filter.handler();
    }

    setActiveFilters(
      activeFilter
        ? activeFilters.filter((f) => f.id !== id)
        : [...activeFilters, filter]
    );
  };

  const [sortedData, handleSorting] = useSorting(tableData);

  const {
    rows: paginatedData,
    emptyRows,
    showPagination,
    ...pagination
  } = usePagination(sortedData);

  const csvData = (): string[][] => {
    if (!props.csvHeaders) return [];
    const rows = [props.csvHeaders];
    sortedData?.forEach((row) => {
      const vals: any[] = [];
      Object.keys(row)?.forEach((key) => {
        row[key]?.csvValues &&
          row[key]?.csvValues.forEach((val: any) => {
            vals.push(val);
          });
      });
      rows.push(vals);
    });
    // @ts-ignore
    return rows;
  };

  const isLoading = props.loading;
  const isEmpty =
    !props.loading && !sortedData?.length && activeFilters.length === 0;

  const hideSearchbar =
    props.hideSearchbar || filters.some((f) => f.type === "search");
  const hideFilters = filters.length === 0 || props.disableSearch;

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

        <div className="mb-2 flex h-min items-center gap-x-1 pr-2">
          {!hideSearchbar && (
            <SearchBar
              value={textToFilter}
              onChange={(value) => {
                if (value && !activeFilters.some((f) => f.type === "search")) {
                  setActiveFilters((prev) => [...prev, SEARCH_FILTER]);
                }

                if (!value) {
                  setActiveFilters(
                    activeFilters.filter((f) => f.type !== "search")
                  );
                }

                setTextToFilter(value);
              }}
              className={"max-w-xs justify-self-end"}
            />
          )}

          {!hideFilters && (
            <FilterBox
              className="mr-1"
              handleFilterClick={onClickFilter}
              activeFilters={activeFilters}
              filters={mappedFilters}
            />
          )}

          {props.csvHeaders && (
            <Tooltip content="Download Transaction History as CSV">
              <CSVLink data={csvData()} filename={props.csvFilename}>
                <DownloadIcon height={32} width={32} />
              </CSVLink>
            </Tooltip>
          )}
        </div>
      </div>
      <Table
        {...props}
        handleSorting={handleSorting}
        emptyRows={emptyRows}
        data={paginatedData}
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

      {showPagination && <Pagination className="mt-4" {...pagination} />}
    </div>
  );
};

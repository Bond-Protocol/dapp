import { CSVLink } from "react-csv";
import React, { useMemo, useState } from "react";
import { Cell, Column, Table, TableProps } from "./Table";
import { useSorting } from "hooks/use-sorting";
import { Button, Filter, FilterBox, Loading } from "components";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";

export const toValue = (value: any) => ({ value });
export const toTableData = (
  columns: Column<any>[],
  data: any
): Record<string, Cell> => {
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
    <div className="mt-20 flex w-full flex-col place-items-center">
      <div className="text-3xl">{props.title}</div>
      <div className="my-4">{props.subtext}</div>
      {props.buttonText && (
        <Button onClick={props.onClick}>{props.buttonText}</Button>
      )}
    </div>
  );
};

export type PaginatedTableProps = Omit<TableProps, "handleSorting"> & {
  title?: string | JSX.Element;
  filterText?: string;
  hideSearchbar?: boolean;
  className?: string;
  headingClassName?: string;
  csvHeaders?: string[];
  fallback?: FallbackProps;
  filters?: Filter[];
  onClickRow?: (args: any) => void;
};

export const PaginatedTable = ({ filters = [], ...props }: PaginatedTableProps) => {
  const [activeFilters, setActiveFilters] = useState<Filter[]>(
    filters.filter((f) => f.startActive)
  );

  const tableData = useMemo(
    () =>
      props.data
        ?.filter((d) => activeFilters?.every((f) => f.handler(d)))
        ?.map((d) => {
          const row = toTableData(props.columns, d);
          if (props.onClickRow) {
            //@ts-ignore
            row.onClick = () => props.onClickRow(d);
          }
          return row;
        }),

    [props.data, props.columns, activeFilters.length]
  );

  const [data, handleSorting] = useSorting(tableData);

  const [text, setText] = useState(props.filterText ?? "");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onClickFilter = (id: string) => {
    const filter = filters.find((f) => f.id === id)!;
    const activeFilter = activeFilters.find((f) => f.id === id);

    if (activeFilter) {
      setActiveFilters(activeFilters.filter((f) => f.id !== id));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const toggleAll = () => {
    setRowsPerPage(rowsPerPage === -1 ? 10 : -1);
    setPage(0);
  };

  const textToFilter = text;
  const filteredData = data?.filter((r) =>
    Object.values(r).some((v) => {
      const value = v?.searchValue || v?.value;
      return String(value).toLowerCase().includes(textToFilter.toLowerCase());
    })
  );

  const csvData = (): string[][] => {
    if (!props.csvHeaders) return;
    const rows = [props.csvHeaders];
    filteredData?.forEach((row) => {
      const vals: any[] = [];
      Object.keys(row)?.forEach((key) => {
        row[key]?.csvValues &&
          row[key]?.csvValues.forEach((val) => {
            vals.push(val);
          });
      });
      rows.push(vals);
    });
    // @ts-ignore
    return rows;
  };

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

        <div className="mb-2 flex flex h-min items-center gap-x-1 pr-2">
          {props.csvHeaders && (
            <CSVLink data={csvData()}>
              <DownloadIcon height={32} width={32} />
            </CSVLink>
          )}

          {!!filters.length && (
            <FilterBox
              handleFilterClick={onClickFilter}
              activeFilters={activeFilters}
              filters={filters}
            />
          )}

          {!props.hideSearchbar && (
            <SearchBar
              value={text}
              onChange={setText}
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

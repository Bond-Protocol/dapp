import { useState, useEffect } from "react";

export const useSorting = (
  rawData?: Array<Record<string, any>>
): [Array<Record<string, any>>, (field: string, order: string) => void] => {
  const [data, setData] = useState(rawData);

  useEffect(() => {
    if (!data || !rawData?.length || data?.length !== rawData?.length) {
      setData(rawData);
    }
  }, [rawData, rawData?.length]);

  const handleSorting = (sortField: string, sortOrder: string) => {
    if (sortField) {
      const sorted =
        data &&
        [...data].sort((a, b) => {
          const current = a[sortField]?.sortValue || a[sortField].value;
          const next = b[sortField]?.sortValue || b[sortField].value;
          console.log({ current, next });
          if (!current) return 1;
          if (!next) return -1;
          if (!current && !next) return 0;

          return (
            current.toString().localeCompare(next.toString(), "en", {
              numeric: true,
            }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
      console.log({ sorted });
      setData(sorted);
    }
  };

  //@ts-ignore
  return [data, handleSorting];
};

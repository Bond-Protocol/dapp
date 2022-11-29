import { useState, useEffect } from "react";

export const useSorting = (
  rawData?: Array<Record<string, any>>
): [Array<Record<string, any>>, () => void] => {
  const [data, setData] = useState(rawData);

  useEffect(() => {
    if (!data) {
      setData(rawData);
    }
  }, [rawData]);

  const handleSorting = (sortField: string, sortOrder: string) => {
    if (sortField) {
      const sorted =
        data &&
        [...data].sort((a, b) => {
          const current = a[sortField]?.sortValue || a[sortField].value;
          const next = b[sortField]?.sortValue || b[sortField].value;
          if (!current) return 1;
          if (!next) return -1;
          if (!current && !next) return 0;

          return (
            current.toString().localeCompare(next.toString(), "en", {
              numeric: true,
            }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
      setData(sorted);
    }
  };

  return [data, handleSorting];
};

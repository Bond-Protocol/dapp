import { useEffect, useState } from "react";

export const useSorting = (
  rawData?: Array<Record<string, any>>
): [Array<Record<string, any>>, (field: string, order: string) => void] => {
  const [data, setData] = useState(rawData);

  useEffect(() => {
    setData(rawData);
  }, [rawData, rawData?.length]);

  const handleSorting = (sortField: string, sortOrder: string) => {
    if (sortField) {
      const sorted =
        data &&
        [...data].sort((a, b) => {
          let current = a[sortField]?.sortValue || a[sortField].value;
          let next = b[sortField]?.sortValue || b[sortField].value;
          if (!current) return 1;
          if (!next) return -1;
          if (!current && !next) return 0;

          if (isNaN(current) || current === Infinity || current === -Infinity)
            current = 0;
          if (isNaN(next) || next === Infinity || next === -Infinity) next = 0;

          const numA = parseFloat(current);
          const numB = parseFloat(next);

          if (numA < numB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (numA > numB) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;

          return (
            current.toString().localeCompare(next.toString(), "en", {
              numeric: true,
            }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
      setData(sorted);
    }
  };

  //@ts-ignore
  return [data, handleSorting];
};

export const handleSorting = (
  sortField: string,
  sortOrder: string,
  data: Array<Record<string, any>>
) => {
  return data.sort((a, b) => {
    const current = a[sortField]?.sortValue || a[sortField].value;
    const next = b[sortField]?.sortValue || b[sortField].value;

    if (!current) return 1;
    if (!next) return -1;
    if (!current && !next) return 0;

    if (!isNaN(current) && !isNaN(next)) {
      const numA = parseFloat(current);
      const numB = parseFloat(next);

      if (numA < numB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (numA > numB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    }

    return (
      current.toString().localeCompare(next.toString(), "en", {
        numeric: true,
      }) * (sortOrder === "asc" ? 1 : -1)
    );
  });
};

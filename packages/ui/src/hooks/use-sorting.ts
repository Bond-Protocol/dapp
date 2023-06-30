import { useEffect, useState } from "react";

export const useSorting = (
  rawData?: Array<Record<string, any>>
): [Array<Record<string, any>>, (field: string, order: string) => void] => {
  const [data, setData] = useState(rawData ?? []);
  const [lastField, setLastField] = useState<string>();
  const [lastOrder, setLastOrder] = useState<string>();

  useEffect(() => {
    if (lastField && lastOrder && rawData) {
      const sorted = handleSorting(lastField, lastOrder, rawData);
      setData(sorted);
    } else {
      setData(rawData ?? []);
    }
  }, [rawData, rawData?.length]);

  const sort = (sortField: string, sortOrder: string) => {
    if (sortField) {
      if (data) {
        const sorted = handleSorting(sortField, sortOrder, data);
        setData(sorted);
        setLastField(sortField);
        setLastOrder(sortOrder);
      }
    }
  };

  return [data, sort];
};

export const handleSorting = (
  sortField: string,
  sortOrder: string,
  data: Array<Record<string, any>>
) => {
  return data.sort((a, b) => {
    const current = a[sortField]?.sortValue || a[sortField]?.value;
    const next = b[sortField]?.sortValue || b[sortField]?.value;

    return (
      current?.toString().localeCompare(next?.toString(), "en", {
        numeric: true,
      }) * (sortOrder === "asc" ? 1 : -1)
    );
  });
};

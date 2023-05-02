//@ts-nocheck
import { Meta, StoryFn } from "@storybook/react";
import { data } from "../mock-data/table";
import { DiscountLabel, PaginatedTable, Button } from "components";
import { MouseEventHandler } from "react";

const tableData = Array(87).fill(data[0]);
const sortableData = [...data];

const cols = [
  {
    label: "Bond",
    width: "w-[18%]",
    accessor: "bond",
    unsortable: true,
  },
  { label: "Bond Price", accessor: "price" },
  {
    label: "Discount",
    accessor: "discount",
    width: "w-[6%]",
    alignEnd: true,
    Component: DiscountLabel,
  },
  {
    label: "Max Payout",
    accessor: "maxPayout",
    alignEnd: true,
  },
  { label: "Vesting", accessor: "vesting" },
  {
    label: "Creation Date",
    accessor: "creationDate",
    defaultSortOrder: "asc",
  },
  { label: "TBV", accessor: "tbv", width: "w-[8%]", alignEnd: true },
  { label: "Issuer", accessor: "issuer" },
  {
    label: "",
    accessor: "view",
    width: "w-[7%]",
    alignEnd: true,
    unsortable: true,
    Component: ({
      value,
      ...props
    }: {
      value: string;
      onClick: MouseEventHandler<any>;
    }) => (
      <Button
        thin
        size="sm"
        variant="ghost"
        className="mr-4"
        onClick={props.onClick}
      >
        View
      </Button>
    ),
  },
];

export default {
  title: "Design System/Molecules/PaginatedTable",
  component: PaginatedTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PaginatedTable>;

export const Primary = {
  args: {
    data: tableData,
    columns: cols,
    defaultSort: "creationDate",
  },
};

export const Sorting = {
  args: {
    data: sortableData,
    columns: cols,
    defaultSort: "creationDate",
  },
};

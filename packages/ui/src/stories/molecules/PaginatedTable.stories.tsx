//@ts-nocheck
import { Meta, StoryFn } from "@storybook/react";
import data from "../mock-data/table";
import { base as columns } from "../mock-data/columns";
import { DiscountLabel, PaginatedTable, Button } from "components";
import { MouseEventHandler } from "react";

export default {
  title: "Design System/Molecules/PaginatedTable",
  component: PaginatedTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PaginatedTable>;

export const Primary = {
  args: {
    data,
    columns,
    defaultSort: "creationDate",
    loading: false,
  },
};

export const Loading = {
  args: {
    ...Primary.args,
    data: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    ...Primary.args,
    data: [],
    fallback: {
      title: "The fallbackooor",
      subtext: "oooh im falling baaaaaaack",
      buttonText: "Fallback harder",
    },
  },
};

export const Filters = {
  args: {
    ...Primary.args,
    filters: [
      {
        id: "cool",
        label: "Switch things",
        type: "switch",
        handler: () => console.log("handling"),
      },
      {
        id: "search",
        type: "search",
        label: "Search",
      },
    ],
  },
};

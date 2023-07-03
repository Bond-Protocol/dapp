import { Meta } from "@storybook/react";
import { FilterBox } from "components";

export default {
  title: "Design System/Molecules/FilterBox",
  component: FilterBox,
  argTypes: {},
} as Meta<typeof FilterBox>;

export const Primary = {
  args: {
    filters: [
      {
        id: "afx",
        type: "text",
        label: "Search",
        handler: (args) => console.log({ args }),
      },
    ],
    activeFilters: [],
  },
};

import { Meta, StoryFn } from "@storybook/react";
import { TableHeading } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/TableHeading",
  component: TableHeading,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof TableHeading>;

const Template: StoryFn<typeof TableHeading> = (args) => (
  <table>
    <thead>
      <tr>
        <TableHeading {...args} />
      </tr>
    </thead>
  </table>
);

const Multiple: StoryFn<typeof TableHeading> = (args) => (
  <table>
    <tr className="child:px-4">
      <TableHeading {...args} />
      <TableHeading {...args} />
      <TableHeading {...args} />
      <TableHeading {...args} />
    </tr>
  </table>
);

export const Primary = {
  render: Template,

  args: {
    children: "LABEL",
    onClick: () => {},
  },
};

export const Tooltip = {
  render: Template,

  args: {
    children: "LABEL",
    tooltip: "Line 577?",
  },
};

export const Row = {
  render: Multiple,
  args: Tooltip.args,
};

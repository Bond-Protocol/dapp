import { Meta, StoryFn } from "@storybook/react";
import { TableCell } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/TableCell",
  component: TableCell,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof TableCell>;

const Template: StoryFn<typeof TableCell> = (args) => (
  <table>
    <thead>
      <tr>
        <TableCell {...args} />
      </tr>
    </thead>
  </table>
);

export const Primary = {
  render: Template,

  args: {
    children: "LABEL",
  },
};

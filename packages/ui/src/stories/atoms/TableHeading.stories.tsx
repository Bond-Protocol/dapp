import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TableHeading } from "components/atoms/TableHeading";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/TableHeading",
  component: TableHeading,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TableHeading>;

const Template: ComponentStory<typeof TableHeading> = (args) => (
  <table>
    <thead>
      <tr>
        <TableHeading {...args} />
      </tr>
    </thead>
  </table>
);

const Multiple: ComponentStory<typeof TableHeading> = (args) => (
  <table>
    <tr className="child:px-4">
      <TableHeading {...args} />
      <TableHeading {...args} />
      <TableHeading {...args} />
      <TableHeading {...args} />
    </tr>
  </table>
);

export const Primary = Template.bind({});
Primary.args = {
  children: "LABEL",
  onClick: () => {},
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  children: "LABEL",
  tooltip: "Line 577?",
};

export const Row = Multiple.bind({});
Row.args = Tooltip.args;

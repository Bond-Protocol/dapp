import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TableHeading } from "../components/atoms/TableHeading";
import { TableCell } from "../components/atoms/TableCell";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/TableHeader",
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
    <thead>
      <tr>
        <TableHeading {...args} />
        <TableHeading {...args} />
        <TableHeading {...args} />
        <TableHeading {...args} />
      </tr>
    </thead>
    <tbody>
      <tr>
        <TableCell className="text-right">ok</TableCell>
        <TableCell>ok</TableCell>
        <TableCell>ok</TableCell>
        <TableCell>ok</TableCell>
      </tr>
    </tbody>
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

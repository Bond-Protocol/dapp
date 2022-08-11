import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TableCell } from "../components/atoms/TableCell";
import TestIcon from "../styles/icons/test-icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/TableCell",
  component: TableCell,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TableCell>;

const Template: ComponentStory<typeof TableCell> = (args) => (
  <table>
    <thead>
      <tr>
        <TableCell {...args} />
      </tr>
    </thead>
  </table>
);

export const Primary = Template.bind({});
Primary.args = {
  children: "LABEL",
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  children: "LABEL",
  tooltip: "Line 577?",
};

export const Icon = Template.bind({});
Icon.args = {
  children: "LABEL",
  icon: <TestIcon className="fill-brand-texas-rose" />,
};

export const Full = Template.bind({});
Full.args = {
  children: "LABEL",
  tooltip: "gm fren",
  icon: <TestIcon className="fill-white" />,
};

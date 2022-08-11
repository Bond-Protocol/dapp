import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TableHeader } from "../components/atoms/TableHeader";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/TableHeader",
  component: TableHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TableHeader>;

const Template: ComponentStory<typeof TableHeader> = (args) => (
  <table>
    <thead>
      <tr>
        <TableHeader {...args} />
      </tr>
    </thead>
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

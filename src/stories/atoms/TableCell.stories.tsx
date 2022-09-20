import {ComponentMeta, ComponentStory} from "@storybook/react";
import {TableCell} from "../components/atoms/TableCell";

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

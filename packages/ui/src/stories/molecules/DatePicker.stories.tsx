import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DatePicker } from "../../components/molecules/DatePicker";

export default {
  title: "Components/Molecules/DatePicker",
  component: DatePicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => (
  <div>
    <DatePicker {...args} />
    <div>hello</div>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  onChange: (d: number) => 1503123051,
  label: "cool",
};

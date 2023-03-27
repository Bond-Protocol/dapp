import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DatePicker } from "../../components/molecules/DatePicker";

export default {
  title: "Design System/Molecules/DatePicker",
  component: DatePicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => (
  <div className="w-min">
    <DatePicker {...args} />
  </div>
);

export const Primary = Template.bind({});

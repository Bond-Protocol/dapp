import { Meta, StoryFn } from "@storybook/react";
import { DatePicker } from "components";

export default {
  title: "Design System/Molecules/DatePicker",
  component: DatePicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = (args) => (
  <div className="w-min">
    <DatePicker {...args} />
  </div>
);

export const Primary = {
  render: Template,
};

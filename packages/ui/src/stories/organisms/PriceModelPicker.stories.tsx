import { Meta, StoryFn } from "@storybook/react";
import { PriceModelPicker } from "components";

export default {
  title: "Design System/Organisms/PriceModelPicker",
  component: PriceModelPicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PriceModelPicker>;

const Template: StoryFn<typeof PriceModelPicker> = (args) => (
  <div className="">
    <PriceModelPicker {...args} />
  </div>
);

export const Primary = {
  render: Template,
};

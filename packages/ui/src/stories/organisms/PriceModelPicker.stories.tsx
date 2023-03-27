import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceModelPicker } from "../../components/organisms/PriceModelPicker";

export default {
  title: "Design System/Organisms/PriceModelPicker",
  component: PriceModelPicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PriceModelPicker>;

const Template: ComponentStory<typeof PriceModelPicker> = (args) => (
  <div className="">
    <PriceModelPicker {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  onModelChange: () => {},
};

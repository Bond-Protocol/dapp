import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceSlider } from "components";

export default {
  title: "Components/Charts/PriceSlider",
  component: PriceSlider,
} as ComponentMeta<typeof PriceSlider>;

const Template: ComponentStory<typeof PriceSlider> = (args) => (
  <PriceSlider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  startChecked: true,
};

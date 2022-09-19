import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InputCard } from "../components/molecules/InputCard";

export default {
  title: "Components/Molecules/InputCard",
  component: InputCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InputCard>;

const Template: ComponentStory<typeof InputCard> = (args) => (
  <InputCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isConnected: true,
};

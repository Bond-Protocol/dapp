import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InputCard } from "components";

export default {
  title: "Design System/Molecules/InputCard",
  component: InputCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InputCard>;

const Template: ComponentStory<typeof InputCard> = (args) => (
  <InputCard {...args} />
);

const market = {
  maxAmountAccepted: "123",
  quoteToken: {
    symbol: "DAI",
    decimals: 18,
    id: "goerli_0x2899a03ffdab5c90badc5920b4f53b0884eb13cc",
  },
};

export const Primary = Template.bind({});
Primary.args = {
  market,
};

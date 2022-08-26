import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EvmProvider } from "../context/evm-provider";
import { InputCard } from "../components/molecules/InputCard";

const WagmiDecor = (Story) => (
  <EvmProvider>
    <div className="w-[45vw]">
      <Story />
    </div>
  </EvmProvider>
);

export default {
  title: "Components/Molecules/InputCard",
  component: InputCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  decorators: [WagmiDecor],
} as ComponentMeta<typeof InputCard>;

const Template: ComponentStory<typeof InputCard> = (args) => (
  <InputCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isConnected: true,
  children: <></>,
};

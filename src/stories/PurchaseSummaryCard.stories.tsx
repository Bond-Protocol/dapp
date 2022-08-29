import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EvmProvider } from "../context/evm-provider";
import { PurchaseSummaryCard } from "../components/molecules/PurchaseSummaryCard";

const WagmiDecor = (Story) => (
  <EvmProvider>
    <div className="w-[45vw]">
      <Story />
    </div>
  </EvmProvider>
);

export default {
  title: "Components/Molecules/PurchaseSummaryCard",
  component: PurchaseSummaryCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  decorators: [WagmiDecor],
} as ComponentMeta<typeof PurchaseSummaryCard>;

const Template: ComponentStory<typeof PurchaseSummaryCard> = (args) => (
  <PurchaseSummaryCard {...args} />
);

const fields = [
  { label: "You will get", value: "18 OHM" },
  { label: "Tooltip-me", value: "0.01231 DAI", tooltip: "ok" },
  { label: "alsdk", value: "asodko" },
  { label: "alsdk", value: "asodko" },
  { label: "alsdk", value: "asodko" },
];

export const Primary = Template.bind({});
Primary.args = {
  fields,
};

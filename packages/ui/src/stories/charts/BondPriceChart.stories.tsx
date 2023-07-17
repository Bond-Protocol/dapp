import { StoryFn, Meta } from "@storybook/react";
import { BondPriceChart } from "components";

import data from "../mock-data/chart";

export default {
  title: "Components/Charts/BondPriceChart",
  component: BondPriceChart,
  argTypes: {},
} as Meta<typeof BondPriceChart>;

const Template: StoryFn<typeof BondPriceChart> = (args) => (
  <div className="h-[80vh] w-[85vw]">
    <BondPriceChart {...args} />
  </div>
);

export const Primary = {
  render: Template,

  args: {
    payoutTokenSymbol: "wstETH",
    data,
  },
};

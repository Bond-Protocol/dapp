import { StoryFn, Meta } from "@storybook/react";
import { BondPriceChart } from "components";

import data from "./mock-data";

export default {
  title: "Components/Charts/BondPriceChart",
  component: BondPriceChart,
  argTypes: {},
} as Meta<typeof BondPriceChart>;

const Template: StoryFn<typeof BondPriceChart> = (args) => (
  <div className="">
    <BondPriceChart {...args} className="h-[30vh] w-[35vw]" />
  </div>
);

export const Primary = {
  render: Template,

  args: {
    payoutTokenSymbol: "GMX",
    data,
  },
};

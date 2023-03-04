import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BondPriceChart } from "../../components/charts/BondPriceChart";

import data from "./mock-data";

export default {
  title: "Components/Charts/BondPriceChart",
  component: BondPriceChart,
  argTypes: {},
} as ComponentMeta<typeof BondPriceChart>;

const Template: ComponentStory<typeof BondPriceChart> = (args) => (
  <div className="">
    <BondPriceChart {...args} className="h-[40vh] w-[45vw]" />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  data,
  payoutTokenSymbol: "GMX",
};

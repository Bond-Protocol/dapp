import { LineChart } from "../components/organisms/LineChart";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { prices, discounts } from "../../src/utils/mock-data";

const dataset = prices.map((p, i) => {
  return { date: p.date, price: p.price, discount: discounts[i].price };
});

export default {
  title: "Components/Organisms/Chart",
  component: LineChart,
  argTypes: {},
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = (args) => (
  <div className="h-[55vh] w-[60vw]">
    <LineChart {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = { data: dataset };

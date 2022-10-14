import { LineChart } from "../components/organisms/LineChart";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { prices, discounts } from "../../src/utils/mock-data";

const data = [
  { label: "Price", data: discounts },
  { label: "Discount", data: prices },
];

const dataset = prices.map((p, i) => {
  return { date: p.date, price: p.price, discount: discounts[i].price };
});

export default {
  title: "Components/Organisms/Chart",
  component: LineChart,
  argTypes: {},
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = (args) => (
  <LineChart {...args} />
);

export const Primary = Template.bind({});
Primary.args = { data: dataset };

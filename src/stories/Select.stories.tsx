import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Select } from "../components/atoms/Select";
import baseLogo from "../assets/icons/eth-icon.svg";

export default {
  title: "Components/Atoms/Select",
  component: Select,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

const tokenOptions = [
  { logo: baseLogo, symbol: "BTC", id: "1" },
  { logo: baseLogo, symbol: "DAI", id: "2" },
  { logo: baseLogo, symbol: "OHM", id: "33" },
  { logo: baseLogo, symbol: "ETH", id: "3" },
  { logo: baseLogo, symbol: "veBPT", id: "4" },
];

export const options = tokenOptions.map((t) => ({ ...t, label: t.symbol }));

export const Primary = Template.bind({});
Primary.args = {
  options: options,
};

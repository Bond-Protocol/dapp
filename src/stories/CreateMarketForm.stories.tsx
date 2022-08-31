import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateMarketForm } from "../components/organisms/CreateMarketForm";
import logo from "../assets/icons/eth-icon.svg";

export default {
  title: "Components/Organisms/CreateMarketForm",
  component: CreateMarketForm,
} as ComponentMeta<typeof CreateMarketForm>;

const Template: ComponentStory<typeof CreateMarketForm> = (args) => (
  <CreateMarketForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};

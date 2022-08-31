import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TokenPickerCard } from "../../components/molecules/TokenPickerCard";
import baseLogo from "../../assets/icons/eth-icon.svg";

export default {
  title: "Components/Molecules/TokenPickerCard",
  component: TokenPickerCard,
} as ComponentMeta<typeof TokenPickerCard>;

const Template: ComponentStory<typeof TokenPickerCard> = (args) => (
  <TokenPickerCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  token: {
    symbol: "20.05 OHM",
    decimals: 18,
    logo: baseLogo,
  },
  checkboxLabel: "I confirm this is the correct token",
  label: "Payout Token",
  subText: "Enter the contract address",
};

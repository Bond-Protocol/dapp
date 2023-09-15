import { StoryObj, Meta } from "@storybook/react";
import { BondPriceLabel as Test } from "components/common/BondPriceLabel";

//const Test = ({ word }: any) => <div>plis work {word}</div>;

export default {
  title: "Components/Common/BondPriceLabel",
  component: Test,
} as Meta<typeof Test>;

type Story = StoryObj<typeof Test>;

export const Primary: Story = {
  args: {
    price: 10,
    bondPrice: "12000",
    symbol: "PLIS",
  },
};

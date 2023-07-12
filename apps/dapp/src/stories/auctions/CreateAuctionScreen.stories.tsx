import { StoryObj, Meta, StoryFn } from "@storybook/react";
import { CreateAuctionScreen } from "../../components/modules/auction/CreateAuctionScreen";

const containerDecorator = (Story: StoryFn) => (
  <div className="max-w-[1136px]">
    <Story />{" "}
  </div>
);
export default {
  title: "Modules/Auction/CreateAuctionScreen",
  component: CreateAuctionScreen,
  decorators: [containerDecorator],
} as Meta<typeof CreateAuctionScreen>;

export const Primary: StoryObj = {
  args: {},
};

import { Meta, StoryFn } from "@storybook/react";
import { TokenCard } from "components";

export default {
  title: "Design System/Molecules/TokenCard",
  component: TokenCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof TokenCard>;

export const Primary = {
  args: {
    token: {
      tbv: 1000000,
      name: "BTRFLY",
      chainId: 1,
      address: "",
      markets: [1, 1, 1, 1],
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/BTRFLY.png",
    },
    leftLabel: "LESGOOOO",
    rightLabel: "Thats whats up",
    navigate: () => {},
  },
};

import { StoryFn, Meta } from "@storybook/react";
import { CloseMarketDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/CloseMarket",
  component: CloseMarketDialog,
  decorators: [ModalDecorator],
} as Meta<typeof CloseMarketDialog>;

export const Primary = {
  args: {
    market: {
      id: "1",
      quoteToken: {
        symbol: "DAI",
      },
      payoutToken: {
        symbol: "GMX",
      },
    },
  },
};

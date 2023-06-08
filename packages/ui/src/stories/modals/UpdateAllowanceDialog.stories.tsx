import { StoryFn, Meta } from "@storybook/react";
import { UpdateAllowanceDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/UpdateAllowance",
  component: UpdateAllowanceDialog,
  decorators: [ModalDecorator],
} as Meta<typeof UpdateAllowanceDialog>;

export const Primary = {
  args: {
    tokens: [
      {
        symbol: "DAI",
        logoURI:
          "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
        allowance: "420000000",
      },
      {
        symbol: "GMX",
        logoURI:
          "https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468",
        allowance: "500000",
      },
    ],
  },
};

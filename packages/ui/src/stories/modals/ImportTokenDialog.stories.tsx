import { Meta } from "@storybook/react";
import { ImportTokenDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/ImportToken",
  component: ImportTokenDialog,
  decorators: [ModalDecorator],
} as Meta<typeof ImportTokenDialog>;

export const Primary = {
  args: {
    token: {
      symbol: "FXS",
      address: "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
      price: 6.99,
      logoURI:
        "https://assets.coingecko.com/coins/images/13423/small/Frax_Shares_icon.png?1679886947",
    },
    priceSource: "Defillama",
  },
};

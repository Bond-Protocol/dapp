import { StoryFn, Meta } from "@storybook/react";
import { Modal, PurchaseConfirmDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/PurchaseConfirm",
  component: PurchaseConfirmDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {
    issuer: "OlympusDAO",
    amount: "333,333 DAI",
    payout: "333 GOHM",
    vestingTime: "12 months",
    auctioneerAddress: "0x12312312312312312312312311414",
    tellerAddress: "0x12312312312312312312312311414",
    blockExplorerURL: "https://etherscan.io/address/",
    blockExplorerName: "Etherscan",
    networkFee: "0.012 ETH",
  },
};

export const Warning = {
  args: {
    ...Primary.args,
    discount: -1,
  },
};

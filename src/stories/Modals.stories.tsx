import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SummaryCard } from "../components/molecules/SummaryCard";
import { Modal } from "../components/molecules/Modal";
import {
  CreateMarketTermsDialog,
  GeneralTermsDialog,
  PurchaseConfirmDialog,
  PurchaseSuccessDialog,
  TransactionHashDialog,
} from "../components/modals";

const ModalDecorator = (Story) => (
  <div className="h-[100vh] border">
    <Modal open={true} onClickClose={() => {}}>
      <Story />
    </Modal>
  </div>
);

const LargeModalDecorator = (Story) => (
  <div className="h-[100vh] border">
    <Modal large open={true} onClickClose={() => {}}>
      <Story />
    </Modal>
  </div>
);

export default {
  title: "Components/Modals",
  component: Modal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SummaryCard>;

export const PurchaseConfirm: ComponentStory<typeof PurchaseConfirmDialog> = (
  args
) => <PurchaseConfirmDialog {...args} />;
PurchaseConfirm.args = {
  issuer: "TexProtocol",
  amount: "33333",
  vestingTime: "7 days",
  contract: "0x1239841234182348912349",
};
PurchaseConfirm.decorators = [ModalDecorator];

export const PurchaseSuccess: ComponentStory<typeof PurchaseSuccessDialog> = (
  args
) => <PurchaseSuccessDialog {...args} />;
PurchaseSuccess.args = {
  issuer: "AphexProtocol",
  goToMarkets: () => {},
  goToBondDetails: () => {},
};

PurchaseSuccess.decorators = [ModalDecorator];

export const TransactionHash: ComponentStory<typeof TransactionHashDialog> = (
  args
) => <TransactionHashDialog {...args} />;
TransactionHash.args = {
  hash: "0xasd9sa90d901230940909123",
};

TransactionHash.decorators = [ModalDecorator];

export const TermsAndConditions: ComponentStory<typeof GeneralTermsDialog> = (
  args
) => <GeneralTermsDialog {...args} />;
TermsAndConditions.decorators = [ModalDecorator];

export const CreateMarketTermsAndConditions: ComponentStory<
  typeof CreateMarketTermsDialog
> = (args) => <CreateMarketTermsDialog {...args} />;

CreateMarketTermsAndConditions.decorators = [LargeModalDecorator];

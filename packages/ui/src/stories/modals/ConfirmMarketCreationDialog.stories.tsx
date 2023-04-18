import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal, ConfirmMarketCreationDialog } from "components";
import { ModalDecorator } from "../decorators";
import { list } from "utils";
const dai = list.find(({ id }) => id === "dai");
const ohm = list.find(({ id }) => id === "olympus");

const state = {
  quoteToken: dai,
  payoutToken: ohm,
  capacityType: "payout",
  capacity: "10000000",
  priceModel: "dynamic",
  oracleAddress: "",
  bondsPerWeek: 7,
  maxBondSize: 1,
  durationInDays: 4,
  recommendedAllowanceDecimalAdjusted: "12",
  vestingString: "7 days",
  priceModels: {
    dynamic: {
      initialPrice: 0.1,
      minPrice: 0.09,
    },
    static: {},
    "oracle-dynamic": {},
    "oracle-static": {},
  },
  oracle: false,
  startDate: new Date(),
  endDate: new Date(),
};

export default {
  title: "Components/Modals/ConfirmMarketCreation",
  component: ConfirmMarketCreationDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof ConfirmMarketCreationDialog> = (args) => (
  <ConfirmMarketCreationDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  //@ts-ignore
  marketState: state,
  showMultisig: false,
  chain: "1",
  hasAllowance: false,
  isAllowanceTxPending: false,
  submitMultisigCreation: () => {},
  submitCreateMarketTransaction: () => {},
  submitApproveSpendingTransaction: () => {},
  getAuctioneer: () => "",
  getTxBytecode: () => "",
};

export const Multisig = Template.bind({});
Multisig.args = {
  ...Primary.args,
  showMultisig: true,
};

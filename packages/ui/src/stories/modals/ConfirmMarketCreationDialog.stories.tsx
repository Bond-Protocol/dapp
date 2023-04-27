import { Meta, StoryFn } from "@storybook/react";
import {
  ConfirmMarketCreationDialog,
  CreateMarketProvider,
  CreateMarketState,
} from "components";
import { ModalDecorator } from "../decorators";
import { list } from "utils";
const dai = list.find(({ id }) => id === "dai");
const ohm = list.find(({ id }) => id === "olympus");

const state: Partial<CreateMarketState> = {
  //@ts-ignore
  quoteToken: dai,
  //@ts-ignore
  payoutToken: ohm,
  capacityType: "payout",
  capacity: "10000000",
  priceModel: "dynamic",
  oracleAddress: "",
  bondsPerWeek: 7,
  maxBondSize: 1,
  durationInDays: 4,
  depositInterval: 24,
  recommendedAllowanceDecimalAdjusted: "12",
  vestingString: "7 days",
  debtBuffer: 40,
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

const overridenState = {
  ...state,
  overridenDepositInterval: 123,
  overridenDebtBuffer: 10,
};

export default {
  title: "Components/Modals/ConfirmMarketCreation",
  component: ConfirmMarketCreationDialog,
  decorators: [ModalDecorator],
} as Meta<typeof ConfirmMarketCreationDialog>;

const Template: StoryFn<typeof ConfirmMarketCreationDialog> = (args) => (
  <div className="max-w-[1136px]">
    {/*@ts-ignore*/}
    <CreateMarketProvider initialState={state}>
      <ConfirmMarketCreationDialog {...args} />
    </CreateMarketProvider>
  </div>
);

export const Primary = {
  render: Template,
  args: {
    marketState: state,
    showMultisig: false,
    chain: "1",
    hasAllowance: false,
    isAllowanceTxPending: false,
    submitMultisigCreation: () => {},
    submitCreateMarketTransaction: () => {},
    submitApproveSpendingTransaction: () => {},
    getAuctioneer: () => "",
    getTeller: () => "",
    getTxBytecode: () => "",
    getAllowanceTxBytecode: () => "",
  },
};

export const Multisig = {
  render: Template,
  args: {
    ...Primary.args,
    showMultisig: true,
  },
};

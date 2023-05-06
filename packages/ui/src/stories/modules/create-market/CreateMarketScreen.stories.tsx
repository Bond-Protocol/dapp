import { Meta, StoryFn } from "@storybook/react";
import {
  CreateMarketProvider,
  CreateMarketScreen,
  placeholderState,
} from "components";
import { list } from "src/utils";

export default {
  title: "Modules/CreateMarket",
  component: CreateMarketScreen,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof CreateMarketScreen>;

const Template: StoryFn<typeof CreateMarketScreen> = (args) => (
  <div className="max-w-[1136px]">
    <CreateMarketProvider initialState={placeholderState}>
      <CreateMarketScreen {...args} />
    </CreateMarketProvider>
  </div>
);

export const Primary = {
  render: Template,

  args: {
    onSubmitCreation: (state) => console.log({ state }),
    onSubmitAllowance: (state) => console.log({ state }),
    onSubmitMultisigCreation: () => {},
    projectionData: [],
    fetchAllowance: () => Promise.resolve(1),
    getAuctioneer: () => "",
    getTeller: () => "",
    getTxBytecode: () => "",
    getApproveTxBytecode: () => "",
    chain: "5",
    tokens: list,
    isAllowanceTxPending: false,
    creationHash: "",
    blockExplorerUrl: "",
    blockExplorerName: "",
  },
};

import { ComponentMeta, ComponentStory } from "@storybook/react";
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
} as ComponentMeta<typeof CreateMarketScreen>;

const Template: ComponentStory<typeof CreateMarketScreen> = (args) => (
  <div className="max-w-[1136px]">
    <CreateMarketProvider initialState={placeholderState}>
      <CreateMarketScreen {...args} />
    </CreateMarketProvider>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  onSubmitCreation: (state) => console.log({ state }),
  onSubmitAllowance: (state) => console.log({ state }),
  onSubmitMultisigCreation: () => {},
  projectionData: [],
  fetchAllowance: () => Promise.resolve(1),
  getAuctioneer: () => "",
  getTxBytecode: () => "",
  chain: "5",
  tokens: list,
  isAllowanceTxPending: false,
  creationHash: "",
  blockExplorerUrl: "",
  blockExplorerName: "",
};

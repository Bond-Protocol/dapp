import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CreateMarketScreen } from "components";

export default {
  title: "Modules/CreateMarket",
  component: CreateMarketScreen,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateMarketScreen>;

const Template: ComponentStory<typeof CreateMarketScreen> = (args) => (
  <div className="max-w-[1136px]">
    <CreateMarketScreen {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  onSubmit: (state) => console.log({ state }),
  onSubmitMultisig: (state) => console.log({ state }),
};

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CreateMarketScreen } from "../../components/screens/CreateMarketScreen";

export default {
  title: "Screens/CreateMarketScreen",
  component: CreateMarketScreen,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CreateMarketScreen>;

const Template: ComponentStory<typeof CreateMarketScreen> = (args) => (
  <CreateMarketScreen {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onSubmit: (state) => console.log({ state }),
  onSubmitMultisig: (state) => console.log({ state }),
};

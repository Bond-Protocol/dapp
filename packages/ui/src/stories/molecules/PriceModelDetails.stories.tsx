import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceModelDetails } from "components";

export default {
  title: "Design System/Molecules/PriceModelDetails",
  component: PriceModelDetails,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PriceModelDetails>;

const Base: ComponentStory<typeof PriceModelDetails> = (args) => (
  <PriceModelDetails {...args} />
);

export const Primary = Base.bind({});
Primary.args = {};

export const Oracle = Base.bind({});
Oracle.args = {
  oracle: true,
  type: "dynamic",
  onOracleChange: () => {},
};

export const All: ComponentStory<typeof PriceModelDetails> = (args) => (
  <div className="child:pb-20">
    <Base {...args} type="dynamic" />
    <Base {...args} type="static" />
    <Base {...args} oracle type="dynamic" />
    <Base {...args} oracle type="static" />
  </div>
);

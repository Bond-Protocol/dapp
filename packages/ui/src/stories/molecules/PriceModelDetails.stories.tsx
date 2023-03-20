//@ts-nocheck
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceModelDetails } from "components/molecules/PriceModelDetails";

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
};

export const All = () => {
  return (
    <div className="child:pb-20">
      <Base type="dynamic" />
      <Base type="static" />
      <Base oracle type="dynamic" />
      <Base oracle type="static" />
    </div>
  );
};

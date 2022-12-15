import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateMarketTermsDialog } from "../../components/modals";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/CreateMarketTerms",
  component: CreateMarketTermsDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof CreateMarketTermsDialog>;

const Template: ComponentStory<typeof CreateMarketTermsDialog> = (args) => (
  <CreateMarketTermsDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};

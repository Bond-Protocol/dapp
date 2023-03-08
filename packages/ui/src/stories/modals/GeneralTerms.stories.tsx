import { ComponentStory, ComponentMeta } from "@storybook/react";
import { GeneralTermsDialog } from "../../components/modals";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/GeneralTerms",
  component: GeneralTermsDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof GeneralTermsDialog>;

const Template: ComponentStory<typeof GeneralTermsDialog> = (args) => (
  <GeneralTermsDialog {...args} />
);

export const Primary = Template.bind({});

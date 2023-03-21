import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";
import { TokenPickerDialog } from "../../components/modals/TokenPickerDialog";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/TokenPicker",
  component: TokenPickerDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof TokenPickerDialog> = (args) => (
  <TokenPickerDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  onSubmit: (onSubmitArgs: any) => {
    console.log({ onSubmitArgs });
  },
};

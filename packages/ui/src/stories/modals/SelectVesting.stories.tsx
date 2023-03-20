import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";
import { SelectVestingDialog } from "../../components/modals/SelectVestingDialog";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/SelectVesting",
  component: SelectVestingDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof SelectVestingDialog> = (args) => (
  <SelectVestingDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  onSubmit: (onSubmitArgs: any) => {
    console.log({ onSubmitArgs });
  },
};

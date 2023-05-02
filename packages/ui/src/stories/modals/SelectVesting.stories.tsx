import { StoryFn, Meta } from "@storybook/react";
import { Modal, SelectVestingDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/SelectVesting",
  component: SelectVestingDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {
    onSubmit: (onSubmitArgs: any) => {
      console.log({ onSubmitArgs });
    },
  },
};

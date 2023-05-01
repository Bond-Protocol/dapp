import { StoryFn, Meta } from "@storybook/react";
import { Modal, SelectTokenDialog } from "components";

import { ModalDecorator } from "../decorators";
import { list as tokenList } from "utils";

export default {
  title: "Components/Modals/SelectToken",
  component: SelectTokenDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {
    tokens: [
      ...tokenList,
      ...tokenList,
      ...tokenList,
      ...tokenList,
      ...tokenList,
    ],
  },
};

import { StoryFn, Meta } from "@storybook/react";
import { Modal, SelectTokenDialog } from "components";
import ethLogo from "assets/icons/ethereum.svg";

import { ModalDecorator } from "../decorators";
import { list as tokenList } from "utils";

const icons = [
  { src: ethLogo, id: "1" },
  { src: ethLogo, id: 42161 },
];

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
    icons,
    selected: "1",
  },
};

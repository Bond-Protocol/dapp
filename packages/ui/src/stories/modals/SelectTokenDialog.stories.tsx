import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";
import { SelectTokenDialog } from "../../components/modals/SelectTokenDialog";

import { ModalDecorator } from "../decorators";
import { list as tokenList } from "utils/sample-tokens";

export default {
  title: "Components/Modals/SelectToken",
  component: SelectTokenDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof SelectTokenDialog> = (args) => (
  <SelectTokenDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  tokens: [
    ...tokenList,
    ...tokenList,
    ...tokenList,
    ...tokenList,
    ...tokenList,
  ],
};

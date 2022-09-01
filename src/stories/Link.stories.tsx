import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Link } from "../components/atoms/Link";

export default {
  title: "Components/Atoms/Link",
  component: Link,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "LABEL",
};

export const Icon = Template.bind({});
Icon.args = {};

export const States: ComponentStory<typeof Link> = (args) => (
  <div className="grid gap-4">
    <Link {...args}>REGULAR</Link>
    <Link id="hover" {...args}>
      HOVER
    </Link>
    <Link disabled={true} {...args}>
      DISABLED
    </Link>
    <Link id="active" {...args}>
      ACTIVE
    </Link>
  </div>
);

States.parameters = {
  pseudo: {
    hover: ["#hover"],
    active: ["#active"],
  },
};

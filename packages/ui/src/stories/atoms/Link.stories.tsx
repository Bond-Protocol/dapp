import { StoryObj, Meta, StoryFn } from "@storybook/react";
import { Link } from "components";

export default {
  title: "Design System/Atoms/Link",
  component: Link,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof Link>;

export const Primary = {
  args: {
    children: "LABEL",
  },
};

export const Icon = {
  args: {},
};

export const States: StoryObj<typeof Link> = {
  render: (args) => (
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
  ),

  parameters: {
    pseudo: {
      hover: ["#hover"],
      active: ["#active"],
    },
  },
};

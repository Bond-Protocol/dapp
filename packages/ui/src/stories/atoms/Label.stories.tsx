import { StoryFn, Meta } from "@storybook/react";
import logo from "assets/logo-24.svg";
import { Label, Link, Tooltip } from "components";

export default {
  title: "Design System/Atoms/Label",
  component: Label,
  argTypes: {},
  args: {
    value: "Label",
  },
} as Meta<typeof Label>;

export const Primary = {};

export const Subtext = {
  args: {
    subtext: "hello",
  },
};

export const Icon = {
  args: {
    icon: logo,
  },
};

export const All = {
  args: {
    ...Subtext.args,
    ...Icon.args,
  },
};

export const Loading = {
  args: {
    ...Icon.args,
    value: null,
    subtext: null,
  },
};

export const WithTooltip = {
  args: {
    children: (
      <Tooltip
        content="1) What"
        iconWidth={13.3}
        iconClassname="pt-0.5 ml-1 fill-white my-auto"
      />
    ),
  },
};

export const WithLink = {
  args: {
    children: <Link href="" iconClassName="ml-1.5" />,
  },
};

import { Meta, StoryFn } from "@storybook/react";
import { Button } from "../../components/atoms/Button";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof Button>;

const MultiTemplate: StoryFn<any> = ({ buttons, ...args }) => {
  return (
    <div className="">
      {buttons.map((b: any, i: number) => (
        <>
          {args.showIndex ? `${i}:` : ""}
          <Button {...b} {...args} key={i} className="m-2 max-w-[160px]" />
        </>
      ))}
    </div>
  );
};

const VariantsTemplate: StoryFn<any> = (args) => {
  return (
    <>
      <div className="flex w-1/3 justify-around">
        <p>Primary</p>
        <p>Secondary</p>
        <p>Ghost</p>
      </div>
      <div className="grid w-1/3 grid-flow-col grid-rows-4">
        {args.buttons.map((b: any, i: number) => (
          <>
            {args.showIndex ? `${i}:` : ""}
            <Button {...b} key={i} className="m-2 max-w-[160px]" />
          </>
        ))}
      </div>
    </>
  );
};

const sample = {
  text: "LABEL",
  Element: (props: any) => <p {...props}>LABEL</p>,
  Complex: () => (
    <div className="flex items-center text-center">
      <p>LABEL</p>
    </div>
  ),
};

export const Primary = {
  args: {
    children: sample.text,
    variant: "primary",
  },
};

export const Secondary = {
  args: {
    children: <sample.Element />,
    variant: "secondary",
  },
};

export const Ghost = {
  args: {
    children: <sample.Element />,
    variant: "ghost",
  },
};

export const WithIcon = {
  args: {
    children: <sample.Complex />,
  },
};

export const IconOnly = {
  args: {
    variant: "ghost",
    children: (
      <div className="my-[2px] flex h-4 w-4 items-center justify-center transition-all duration-300">
        <PlusIcon className="group-hover/button:fill-light-secondary fill-white" />
      </div>
    ),
    icon: true,
  },
};

export const Alignment = {
  render: MultiTemplate,

  args: {
    buttons: [
      {
        children: "left",
        align: "left",
      },
      {
        children: "center",
        align: "left",
      },
      {
        children: "right",
        align: "right",
      },
    ],
  },
};

export const Sizes = {
  render: MultiTemplate,

  args: {
    buttons: [
      {
        children: "smol",
        size: "sm",
      },
      {
        children: "medium",
      },
      {
        children: "chonky",
        size: "lg",
      },
    ],
  },
};

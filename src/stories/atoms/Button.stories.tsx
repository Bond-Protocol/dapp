import {ComponentMeta, ComponentStory} from "@storybook/react";
import TestIcon from "../styles/icons/test-icon";
import {Button} from "../components/atoms/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const MultiTemplate: ComponentStory<any> = ({ buttons, ...args }) => {
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

const VariantsTemplate: ComponentStory<any> = (args) => {
  return (
    <>
      <div className="flex justify-around w-1/3">
        <p>Primary</p>
        <p>Secondary</p>
        <p>Ghost</p>
      </div>
      <div className="grid grid-rows-4 grid-flow-col w-1/3">
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
  icon: <TestIcon className="fill-brand-covenant" />,
  Element: (props: any) => <p {...props}>LABEL</p>,
  Complex: () => (
    <div className="flex text-center items-center">
      <TestIcon className="mx-2 fill-brand-covenant" />
      <p>LABEL</p>
    </div>
  ),
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {
  children: sample.text,
  variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: <sample.Element />,
  variant: "secondary",
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: <sample.Element />,
  variant: "ghost",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: <sample.Complex />,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  children: <TestIcon className="fill-brand-covenant" />,
  icon: true,
};

export const States = VariantsTemplate.bind({});
States.args = {
  buttons: [
    { children: "Normal", variant: "primary" },
    { children: "Hover", variant: "primary", id: "hover" },
    { children: "Disabled", variant: "primary", disabled: true },
    { children: "Active", variant: "primary", id: "active" },

    { children: "Normal", variant: "secondary" },
    { children: "Hover", variant: "secondary", id: "hover" },
    { children: "Disabled", variant: "secondary", disabled: true },
    { children: "Active", variant: "secondary", id: "active" },

    { children: "Normal", variant: "ghost" },
    { children: "Hover", variant: "ghost", id: "hover" },
    { children: "Disabled", variant: "ghost", disabled: true },
    { children: "Active", variant: "ghost", id: "active" },
  ],
};

States.parameters = {
  pseudo: {
    hover: ["#hover"],
    active: ["#active"],
  },
};

export const Alignment = MultiTemplate.bind({});
Alignment.args = {
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
};

export const Sizes = MultiTemplate.bind({});
Sizes.args = {
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
};

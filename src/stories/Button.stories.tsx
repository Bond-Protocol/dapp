import { ComponentStory, ComponentMeta } from "@storybook/react";
import TestIcon from "../styles/icons/test-icon";

import { Button } from "../components/atoms/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const MultiButtons: ComponentStory<any> = (args) => {
  return (
    <div className="flex">
      {args.buttons.map((b: any, i: number) => (
        <>
          {args.showIndex ? `${i}:` : ""}
          <Button {...b} key={i} className="m-2" />
        </>
      ))}
    </div>
  );
};

const sample = {
  text: "LABEL",
  icon: <TestIcon />,
  Element: (props: any) => <div {...props}>LABEL</div>,
  Complex: () => (
    <div className="flex ">
      <TestIcon className="mx-2" />
      LABEL
    </div>
  ),
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {
  children: sample.text,
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: <sample.Element />,
  secondary: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: <sample.Complex />,
};

export const Alignment = MultiButtons.bind({});
Alignment.args = {
  buttons: [
    {
      children: <sample.Element />,
      align: "left",
    },

    {
      children: <sample.Element />,
      secondary: true,
      align: "right",
    },
  ],

  showIndex: false,
};

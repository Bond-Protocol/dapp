import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SocialRow } from "../../components/atoms/SocialRow";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/SocialRow",
  component: SocialRow,
  argTypes: {},
} as ComponentMeta<typeof SocialRow>;

const Template: ComponentStory<typeof SocialRow> = (args) => (
  <SocialRow {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  githubUrl: "http://hello.com",
  discordUrl: "http://hello.com",
  mediumUrl: "http://hello.com",
  twitterUrl: "http://hello.com",
};

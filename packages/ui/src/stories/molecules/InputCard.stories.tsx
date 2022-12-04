import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IssuerCard } from "components/molecules/IssuerCard";
import logo from "../../assets/logo-24.svg";

export default {
  title: "Components/Molecules/IssuerCard",
  component: IssuerCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    markets: [1, 2, 3],
    tbv: "33420420",
    issuer: {
      id: "bp",
      name: "YourDao",
      logoUrl: logo,
    },
  },
} as ComponentMeta<typeof IssuerCard>;

const Template: ComponentStory<typeof IssuerCard> = (args) => (
  <IssuerCard {...args} />
);

export const Primary = Template.bind({});
